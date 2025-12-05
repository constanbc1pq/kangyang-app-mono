/**
 * 私人医生服务 - 数据服务层
 *
 * 提供私人医生相关的所有数据操作
 * 包括医生管理、签约管理、问诊记录、健康评估、健康计划等
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  PrivateDoctor,
  PrivateDoctorPackage,
  DoctorSubscription,
  ConsultationRecord,
  HealthAssessment,
  HealthPlan,
  DoctorReview,
  MedicalHealthRecord,
  HospitalLevel,
  DoctorTitle,
  DoctorDepartment,
  PackageLevel,
  SubscriptionStatus,
  ConsultationType,
  ConsultationStatus,
  HealthPlanType,
  PRIVATE_DOCTOR_STORAGE_KEYS,
} from '@/types/privateDoctor';
import { createPrivateDoctorOrder, getOrders } from './orderService';

// ==================== 数据初始化 ====================

/**
 * 初始化私人医生数据
 */
export const initializePrivateDoctors = async (): Promise<void> => {
  try {
    const existing = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.DOCTORS);
    if (existing) {
      console.log('私人医生数据已存在，跳过初始化');
      return;
    }

    const doctors: PrivateDoctor[] = [
      // 1. 心内科 - 主任医师 - 协和医院
      {
        id: 'doctor_001',
        name: '王明远教授',
        avatar: 'local:doctor_001',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.CARDIOLOGY,
        verified: true,
        hospital: {
          name: '北京协和医院',
          level: HospitalLevel.TERTIARY_A,
          department: '心内科',
        },
        education: [
          {
            school: '北京协和医学院',
            degree: '临床医学博士',
            major: '心血管内科',
            startYear: '1990',
            endYear: '1998',
          },
        ],
        overseasTraining: [
          {
            institution: '哈佛医学院麻省总医院',
            position: '访问学者',
            startDate: '2005-09',
            endDate: '2006-09',
            description: '冠心病介入治疗研究',
          },
        ],
        certifications: ['心血管内科主任医师', '心脏介入治疗资质', '中国医师协会会员'],
        academicPositions: ['中华医学会心血管分会委员', '北京医学会心血管专业委员会委员'],
        achievements: [
          '发表SCI论文23篇',
          '主持国家自然科学基金2项',
          '获中华医学科技奖二等奖',
        ],
        yearsOfExperience: 28,
        specialties: [
          '冠心病诊治',
          '高血压规范化管理',
          '心律失常治疗',
          '心力衰竭综合治疗',
        ],
        philosophy:
          '预防胜于治疗，管理优于干预。我相信最好的医疗是让患者不生病，而不是等病了再治。作为您的私人医生，我将用28年的临床经验，为您和家人制定个性化的健康守护方案。',
        memberCount: 156,
        rating: 4.9,
        reviewCount: 328,
        isOnline: true,
        responseRate: 98,
        packages: [], // 稍后填充
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 2. 消化内科 - 主任医师 - 上海瑞金医院
      {
        id: 'doctor_002',
        name: '李慧教授',
        avatar: 'local:doctor_002',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士生导师',
        department: DoctorDepartment.GASTROENTEROLOGY,
        verified: true,
        hospital: {
          name: '上海交通大学医学院附属瑞金医院',
          level: HospitalLevel.TERTIARY_A,
          department: '消化内科',
        },
        education: [
          {
            school: '上海交通大学医学院',
            degree: '临床医学博士',
            major: '消化内科',
            startYear: '1985',
            endYear: '1992',
          },
        ],
        overseasTraining: [
          {
            institution: '梅奥诊所',
            position: '高级访问学者',
            startDate: '2008-01',
            endDate: '2009-01',
            description: '炎症性肠病诊疗研究',
          },
        ],
        certifications: ['消化内科主任医师', '内镜介入治疗资质'],
        academicPositions: ['中华医学会消化分会常委', '上海医学会消化专业委员会主任委员'],
        achievements: ['发表SCI论文35篇', '主编消化系统疾病专著2部', '获上海市科技进步一等奖'],
        yearsOfExperience: 32,
        specialties: [
          '炎症性肠病（IBD）诊治',
          '消化道早癌筛查',
          '功能性胃肠病管理',
          '肝硬化综合治疗',
        ],
        philosophy:
          '精准诊断，个性化治疗。每位患者都是独特的，我会根据您的具体情况制定最适合您的治疗方案。',
        memberCount: 189,
        rating: 4.95,
        reviewCount: 412,
        isOnline: true,
        responseRate: 99,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 3. 内分泌科 - 主任医师 - 华西医院
      {
        id: 'doctor_003',
        name: '张伟教授',
        avatar: 'local:doctor_003',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.ENDOCRINOLOGY,
        verified: true,
        hospital: {
          name: '四川大学华西医院',
          level: HospitalLevel.TERTIARY_A,
          department: '内分泌代谢科',
        },
        education: [
          {
            school: '四川大学华西医学中心',
            degree: '内分泌学博士',
            startYear: '1992',
            endYear: '1999',
          },
        ],
        overseasTraining: [
          {
            institution: '约翰·霍普金斯医院',
            position: '访问学者',
            startDate: '2010-03',
            endDate: '2011-03',
            description: '糖尿病并发症防治研究',
          },
        ],
        certifications: ['内分泌科主任医师', '糖尿病专科医师'],
        academicPositions: ['中国医师协会内分泌代谢科医师分会委员'],
        achievements: ['发表论文40余篇', '获四川省科技进步二等奖'],
        yearsOfExperience: 25,
        specialties: ['糖尿病精准管理', '甲状腺疾病诊治', '肥胖症治疗', '骨质疏松防治'],
        philosophy: '慢病管理需要长期坚持，我会成为您健康路上的忠实伙伴。',
        memberCount: 143,
        rating: 4.88,
        reviewCount: 287,
        isOnline: false,
        responseRate: 96,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 4. 呼吸内科 - 副主任医师 - 中日友好医院
      {
        id: 'doctor_004',
        name: '陈静怡副教授',
        avatar: 'local:doctor_004',
        title: DoctorTitle.ASSOCIATE_CHIEF,
        degree: '博士',
        department: DoctorDepartment.RESPIRATORY,
        verified: true,
        hospital: {
          name: '中日友好医院',
          level: HospitalLevel.TERTIARY_A,
          department: '呼吸与危重症医学科',
        },
        education: [
          {
            school: '首都医科大学',
            degree: '呼吸内科博士',
            startYear: '2000',
            endYear: '2007',
          },
        ],
        overseasTraining: [
          {
            institution: '克利夫兰诊所',
            position: '进修医师',
            startDate: '2015-06',
            endDate: '2016-06',
            description: '慢阻肺诊疗新技术',
          },
        ],
        certifications: ['呼吸内科副主任医师', '支气管镜检查资质'],
        academicPositions: ['北京医学会呼吸分会青年委员'],
        achievements: ['发表SCI论文15篇', '参与编写呼吸疾病诊疗指南'],
        yearsOfExperience: 18,
        specialties: ['慢阻肺管理', '哮喘控制', '肺结节评估', '呼吸睡眠障碍'],
        philosophy: '呼吸是生命之本，让我帮助您畅快呼吸每一天。',
        memberCount: 98,
        rating: 4.85,
        reviewCount: 176,
        isOnline: true,
        responseRate: 95,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 5. 全科医学 - 主任医师 - 国际医院
      {
        id: 'doctor_005',
        name: '刘芳华医生',
        avatar: 'local:doctor_005',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '硕士',
        department: DoctorDepartment.GENERAL_MEDICINE,
        verified: true,
        hospital: {
          name: '北京和睦家医院',
          level: HospitalLevel.INTERNATIONAL,
          department: '全科医学科',
        },
        education: [
          {
            school: '北京大学医学部',
            degree: '全科医学硕士',
            startYear: '1995',
            endYear: '2000',
          },
        ],
        overseasTraining: [
          {
            institution: '新加坡中央医院',
            position: '家庭医学培训',
            startDate: '2012-01',
            endDate: '2013-01',
            description: '家庭医学实践培训',
          },
        ],
        certifications: ['全科医学主任医师', '家庭医生资质'],
        academicPositions: ['中国医师协会全科医师分会委员'],
        achievements: ['全科医学实践经验20年', '服务国际家庭超过500个'],
        yearsOfExperience: 24,
        specialties: ['家庭健康管理', '慢病综合管理', '儿童保健', '老年综合评估'],
        philosophy:
          '家庭医生不仅治病，更关注全家人的健康。我会成为您家庭的健康守护者。',
        memberCount: 224,
        rating: 4.92,
        reviewCount: 456,
        isOnline: true,
        responseRate: 99,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 6-10: 添加更多不同科室的医生（简化版）
      {
        id: 'doctor_006',
        name: '赵敏教授',
        avatar: 'local:doctor_006',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.NEUROLOGY,
        verified: true,
        hospital: {
          name: '北京大学第一医院',
          level: HospitalLevel.TERTIARY_A,
          department: '神经内科',
        },
        education: [
          {
            school: '北京大学医学部',
            degree: '神经病学博士',
            startYear: '1988',
            endYear: '1995',
          },
        ],
        overseasTraining: [
          {
            institution: '加州大学旧金山分校',
            position: '博士后研究员',
            startDate: '2000-01',
            endDate: '2002-01',
            description: '神经退行性疾病研究',
          },
        ],
        certifications: ['神经内科主任医师'],
        academicPositions: ['中华医学会神经病学分会委员'],
        achievements: ['发表论文50余篇', '获教育部科技进步一等奖'],
        yearsOfExperience: 30,
        specialties: ['脑血管病防治', '帕金森病管理', '阿尔茨海默病早期干预', '头痛眩晕诊治'],
        philosophy: '脑健康决定生活质量，预防比治疗更重要。',
        memberCount: 167,
        rating: 4.91,
        reviewCount: 345,
        isOnline: false,
        responseRate: 97,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_007',
        name: '孙志强教授',
        avatar: 'local:doctor_007',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.NEPHROLOGY,
        verified: true,
        hospital: {
          name: '复旦大学附属中山医院',
          level: HospitalLevel.TERTIARY_A,
          department: '肾脏内科',
        },
        education: [
          {
            school: '复旦大学上海医学院',
            degree: '肾脏病学博士',
            startYear: '1990',
            endYear: '1997',
          },
        ],
        overseasTraining: [],
        certifications: ['肾内科主任医师', '血液透析资质'],
        academicPositions: ['上海医学会肾脏病学分会委员'],
        achievements: ['发表论文30余篇'],
        yearsOfExperience: 27,
        specialties: ['慢性肾病管理', '高血压肾病', '糖尿病肾病', '肾结石防治'],
        philosophy: '肾脏是沉默的器官，定期检查和及早干预至关重要。',
        memberCount: 112,
        rating: 4.86,
        reviewCount: 198,
        isOnline: true,
        responseRate: 94,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_008',
        name: '周莉副教授',
        avatar: 'local:doctor_008',
        title: DoctorTitle.ASSOCIATE_CHIEF,
        degree: '博士',
        department: DoctorDepartment.ONCOLOGY,
        verified: true,
        hospital: {
          name: '浙江大学医学院附属第一医院',
          level: HospitalLevel.TERTIARY_A,
          department: '肿瘤内科',
        },
        education: [
          {
            school: '浙江大学医学院',
            degree: '肿瘤学博士',
            startYear: '2002',
            endYear: '2009',
          },
        ],
        overseasTraining: [
          {
            institution: 'MD安德森癌症中心',
            position: '访问学者',
            startDate: '2016-07',
            endDate: '2017-07',
            description: '精准肿瘤治疗研究',
          },
        ],
        certifications: ['肿瘤内科副主任医师', '临床试验研究者资质'],
        academicPositions: ['中国抗癌协会会员'],
        achievements: ['发表SCI论文20篇', '主持省级科研项目3项'],
        yearsOfExperience: 16,
        specialties: ['肺癌综合治疗', '消化道肿瘤', '肿瘤筛查与预防', '肿瘤营养支持'],
        philosophy: '早发现、早诊断、早治疗，肿瘤并不可怕。',
        memberCount: 89,
        rating: 4.83,
        reviewCount: 142,
        isOnline: true,
        responseRate: 93,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_009',
        name: '吴磊医生',
        avatar: 'local:doctor_009',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '硕士',
        department: DoctorDepartment.GENERAL_MEDICINE,
        verified: true,
        hospital: {
          name: '上海国际医学中心',
          level: HospitalLevel.INTERNATIONAL,
          department: '全科医学科',
        },
        education: [
          {
            school: '同济大学医学院',
            degree: '临床医学硕士',
            startYear: '1998',
            endYear: '2003',
          },
        ],
        overseasTraining: [
          {
            institution: '伦敦国王学院医院',
            position: '全科培训',
            startDate: '2010-01',
            endDate: '2011-12',
            description: '英国全科医学系统培训',
          },
        ],
        certifications: ['全科医学主任医师', '国际家庭医生认证'],
        academicPositions: [],
        achievements: ['服务高端客户15年经验'],
        yearsOfExperience: 22,
        specialties: ['高端健康管理', 'VIP医疗服务', '慢病预防', '体检报告解读'],
        philosophy: '健康管理是一种生活方式，让我陪伴您追求更高品质的健康。',
        memberCount: 198,
        rating: 4.94,
        reviewCount: 389,
        isOnline: true,
        responseRate: 99,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_010',
        name: '马小康教授',
        avatar: 'local:doctor_010',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.NUTRITION,
        verified: true,
        hospital: {
          name: '广东省中医院',
          level: HospitalLevel.TERTIARY_A,
          department: '治未病中心',
        },
        education: [
          {
            school: '广州中医药大学',
            degree: '中医内科学博士',
            startYear: '1992',
            endYear: '1999',
          },
        ],
        overseasTraining: [],
        certifications: ['中医内科主任医师', '国家级名老中医学术继承人'],
        academicPositions: ['世界中医药学会联合会理事'],
        achievements: ['主编中医养生著作5部', '获国家中医药管理局科技奖'],
        yearsOfExperience: 26,
        specialties: ['中医体质调理', '中西医结合慢病管理', '亚健康调理', '膏方调养'],
        philosophy: '治未病，不治已病。中医讲究整体观念，从根本上调理身体。',
        memberCount: 234,
        rating: 4.89,
        reviewCount: 478,
        isOnline: false,
        responseRate: 95,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      // 11-15: 再添加5位医生
      {
        id: 'doctor_011',
        name: '郑雪医生',
        avatar: 'local:doctor_011',
        title: DoctorTitle.ATTENDING,
        degree: '硕士',
        department: DoctorDepartment.GENERAL_MEDICINE,
        verified: true,
        hospital: {
          name: '北京美中宜和妇儿医院',
          level: HospitalLevel.PRIVATE,
          department: '儿科',
        },
        education: [
          {
            school: '首都儿科研究所',
            degree: '儿科学硕士',
            startYear: '2008',
            endYear: '2013',
          },
        ],
        overseasTraining: [
          {
            institution: '香港大学玛丽医院',
            position: '儿科进修',
            startDate: '2018-03',
            endDate: '2018-09',
            description: '儿童发育与保健',
          },
        ],
        certifications: ['儿科主治医师', '国际母乳喂养顾问'],
        academicPositions: [],
        achievements: ['服务高端家庭儿童保健10年'],
        yearsOfExperience: 12,
        specialties: ['新生儿护理', '儿童生长发育', '儿童营养指导', '疫苗接种咨询'],
        philosophy: '每个孩子都是独特的，科学育儿从了解孩子开始。',
        memberCount: 156,
        rating: 4.96,
        reviewCount: 321,
        isOnline: true,
        responseRate: 98,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_012',
        name: '林燕教授',
        avatar: 'local:doctor_012',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.CARDIOLOGY,
        verified: true,
        hospital: {
          name: '中国医学科学院阜外医院',
          level: HospitalLevel.TERTIARY_A,
          department: '心血管外科',
        },
        education: [
          {
            school: '中国协和医科大学',
            degree: '心血管外科博士',
            startYear: '1987',
            endYear: '1994',
          },
        ],
        overseasTraining: [
          {
            institution: '克利夫兰诊所',
            position: '访问学者',
            startDate: '2002-01',
            endDate: '2003-01',
            description: '心脏外科手术技术',
          },
        ],
        certifications: ['心血管外科主任医师', '心脏移植资质'],
        academicPositions: ['中国医师协会心血管外科医师分会副主任委员'],
        achievements: ['完成心脏手术5000余例', '获国家科技进步二等奖'],
        yearsOfExperience: 31,
        specialties: ['冠脉搭桥手术', '瓣膜疾病外科治疗', '先心病手术', '心脏康复'],
        philosophy: '外科手术只是治疗的一部分，术后的康复管理同样重要。',
        memberCount: 76,
        rating: 4.92,
        reviewCount: 134,
        isOnline: false,
        responseRate: 92,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_013',
        name: '黄丽副教授',
        avatar: 'local:doctor_013',
        title: DoctorTitle.ASSOCIATE_CHIEF,
        degree: '博士',
        department: DoctorDepartment.ENDOCRINOLOGY,
        verified: true,
        hospital: {
          name: '上海市第六人民医院',
          level: HospitalLevel.TERTIARY_A,
          department: '内分泌代谢科',
        },
        education: [
          {
            school: '上海交通大学医学院',
            degree: '内分泌学博士',
            startYear: '2003',
            endYear: '2010',
          },
        ],
        overseasTraining: [],
        certifications: ['内分泌科副主任医师', '糖尿病教育者认证'],
        academicPositions: ['上海市医学会糖尿病分会委员'],
        achievements: ['发表论文25篇', '获上海市医学科技奖三等奖'],
        yearsOfExperience: 15,
        specialties: ['糖尿病管理', '甲状腺疾病', '代谢综合征', '减重管理'],
        philosophy: '糖尿病是可以管理的疾病，规范治疗就能享受正常生活。',
        memberCount: 124,
        rating: 4.87,
        reviewCount: 234,
        isOnline: true,
        responseRate: 96,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_014',
        name: '钱伟医生',
        avatar: 'local:doctor_014',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '硕士',
        department: DoctorDepartment.GENERAL_MEDICINE,
        verified: true,
        hospital: {
          name: '深圳港大医院',
          level: HospitalLevel.INTERNATIONAL,
          department: '全科医学',
        },
        education: [
          {
            school: '香港大学李嘉诚医学院',
            degree: '家庭医学硕士',
            startYear: '2000',
            endYear: '2005',
          },
        ],
        overseasTraining: [
          {
            institution: '香港玛丽医院',
            position: '家庭医学培训',
            startDate: '2005-07',
            endDate: '2008-07',
            description: '家庭医学专科培训',
          },
        ],
        certifications: ['全科医学主任医师', '香港家庭医学院院士'],
        academicPositions: [],
        achievements: ['香港家庭医学实践15年', '服务粤港澳高端客户'],
        yearsOfExperience: 20,
        specialties: ['家庭健康管理', '慢病管理', '健康风险评估', '预防医学'],
        philosophy: '家庭医生是您健康的第一道防线，也是最后的守护者。',
        memberCount: 187,
        rating: 4.98,
        reviewCount: 367,
        isOnline: true,
        responseRate: 99,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },

      {
        id: 'doctor_015',
        name: '宋梅教授',
        avatar: 'local:doctor_015',
        title: DoctorTitle.CHIEF_PHYSICIAN,
        degree: '博士',
        department: DoctorDepartment.RHEUMATOLOGY,
        verified: true,
        hospital: {
          name: '南京鼓楼医院',
          level: HospitalLevel.TERTIARY_A,
          department: '风湿免疫科',
        },
        education: [
          {
            school: '南京医科大学',
            degree: '风湿免疫学博士',
            startYear: '1993',
            endYear: '2000',
          },
        ],
        overseasTraining: [
          {
            institution: '约翰·霍普金斯大学',
            position: '访问学者',
            startDate: '2012-09',
            endDate: '2013-09',
            description: '自身免疫性疾病研究',
          },
        ],
        certifications: ['风湿免疫科主任医师'],
        academicPositions: ['中华医学会风湿病学分会委员'],
        achievements: ['发表论文45篇', '获江苏省医学新技术引进奖一等奖'],
        yearsOfExperience: 25,
        specialties: [
          '类风湿关节炎',
          '系统性红斑狼疮',
          '痛风规范化治疗',
          '骨关节炎管理',
        ],
        philosophy: '风湿病需要长期规范治疗，坚持就能控制病情、提高生活质量。',
        memberCount: 98,
        rating: 4.84,
        reviewCount: 187,
        isOnline: false,
        responseRate: 94,
        packages: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];

    // 为每位医生添加4级套餐
    const packagesForAllDoctors = doctors.map((doctor) => {
      return {
        doctorId: doctor.id,
        packages: createDoctorPackages(doctor.id),
      };
    });

    // 将套餐关联到医生
    packagesForAllDoctors.forEach((item) => {
      const doctor = doctors.find((d) => d.id === item.doctorId);
      if (doctor) {
        doctor.packages = item.packages;
      }
    });

    await AsyncStorage.setItem(PRIVATE_DOCTOR_STORAGE_KEYS.DOCTORS, JSON.stringify(doctors));
    console.log('成功初始化15位私人医生数据');
  } catch (error) {
    console.error('初始化私人医生数据失败:', error);
  }
};

/**
 * 为医生创建4级套餐
 */
const createDoctorPackages = (doctorId: string): PrivateDoctorPackage[] => {
  return [
    // 基础版
    {
      id: `${doctorId}_package_basic`,
      doctorId,
      name: '基础版',
      level: PackageLevel.BASIC,
      duration: 'yearly',
      price: 19800,
      originalPrice: 23800,
      isRecommended: false,
      services: {
        onlineConsultations: 12,
        videoConsults: 4,
        phoneConsults: 6,
        inPersonVisits: 2,
        homeVisits: 0,
        healthAssessments: 1,
      },
      responseTime: '24小时内',
      doctorDirectLine: false,
      directLineHours: '',
      perks: {
        annualCheckup: false,
        specialistReferral: 0,
        greenChannel: false,
        healthManager: false,
        familyMembers: 1,
        internationalReferral: false,
      },
      description: '适合健康状况良好、希望建立长期医患关系的用户',
      highlights: [
        '每月1次在线咨询',
        '每季度1次视频问诊',
        '每半年1次到院面诊',
        '年度健康评估',
      ],
    },

    // 标准版（推荐）
    {
      id: `${doctorId}_package_standard`,
      doctorId,
      name: '标准版',
      level: PackageLevel.STANDARD,
      duration: 'yearly',
      price: 49800,
      originalPrice: 49800,
      isRecommended: true,
      services: {
        onlineConsultations: -1, // 不限次数
        videoConsults: 12,
        phoneConsults: 18,
        inPersonVisits: 4,
        homeVisits: 0,
        healthAssessments: 4,
      },
      responseTime: '4小时内',
      doctorDirectLine: true,
      directLineHours: '工作时间（9:00-21:00）',
      perks: {
        annualCheckup: true,
        checkupValue: 3800,
        specialistReferral: 1,
        greenChannel: true,
        healthManager: false,
        familyMembers: 1,
        internationalReferral: false,
      },
      description: '性价比最高，适合有慢病管理需求或注重健康预防的用户',
      highlights: [
        '不限次数在线咨询',
        '每月1次视频问诊',
        '每季度1次到院面诊',
        '含¥3,800体检套餐',
        '1次专家会诊机会',
      ],
    },

    // 尊享版
    {
      id: `${doctorId}_package_premium`,
      doctorId,
      name: '尊享版',
      level: PackageLevel.PREMIUM,
      duration: 'yearly',
      price: 99800,
      originalPrice: 99800,
      isRecommended: false,
      services: {
        onlineConsultations: -1,
        videoConsults: -1,
        phoneConsults: -1,
        inPersonVisits: 12,
        homeVisits: 2,
        healthAssessments: 12,
      },
      responseTime: '2小时内',
      doctorDirectLine: true,
      directLineHours: '7×24小时',
      perks: {
        annualCheckup: true,
        checkupValue: 8800,
        specialistReferral: 3,
        greenChannel: true,
        healthManager: true,
        familyMembers: 2,
        internationalReferral: true,
      },
      description: '高端医疗服务，配备专属健康管家，适合高净值个人',
      highlights: [
        '不限次数问诊（在线+视频）',
        '每月1次到院面诊',
        '每半年1次上门出诊',
        '专属健康管家',
        '含¥8,800深度体检',
        '绿色通道（住院优先）',
        '国际转诊协助',
      ],
    },

    // VIP家庭版
    {
      id: `${doctorId}_package_vip_family`,
      doctorId,
      name: 'VIP家庭版',
      level: PackageLevel.VIP_FAMILY,
      duration: 'yearly',
      price: 199800,
      originalPrice: 199800,
      isRecommended: false,
      services: {
        onlineConsultations: -1,
        videoConsults: -1,
        phoneConsults: -1,
        inPersonVisits: -1,
        homeVisits: 6,
        healthAssessments: -1,
      },
      responseTime: '30分钟内',
      doctorDirectLine: true,
      directLineHours: '7×24小时',
      perks: {
        annualCheckup: true,
        checkupValue: 18000,
        specialistReferral: -1,
        greenChannel: true,
        healthManager: true,
        familyMembers: 6,
        internationalReferral: true,
      },
      description: '全家健康守护，覆盖6位家庭成员，企业家/家族首选',
      highlights: [
        '全家6人健康守护',
        '不限次数所有问诊',
        '每年6次上门出诊',
        '专属健康管家+团队',
        '含¥18,000贵宾体检',
        'VIP病房优先',
        '不限次专家会诊',
        '国际转诊全程陪同',
      ],
    },
  ];
};

/**
 * 初始化模拟签约数据（已弃用 - 现在签约数据存储在订单中）
 * @deprecated 签约数据现在完全存储在 @kangyang_orders 中，不再使用 @kangyang_my_subscription
 */
export const initializeMockSubscription = async (userId: string): Promise<void> => {
  console.log('⚠️ initializeMockSubscription 已弃用，请使用 subscribeToDoctor 创建签约');
};

// ==================== 私人医生CRUD操作 ====================

/**
 * 获取医生列表（支持筛选）
 */
export const getDoctors = async (filters?: {
  department?: DoctorDepartment;
  hospitalLevel?: HospitalLevel;
  minPrice?: number;
  maxPrice?: number;
  isOnline?: boolean;
  hasOverseasTraining?: boolean;
}): Promise<PrivateDoctor[]> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.DOCTORS);
    if (!data) {
      await initializePrivateDoctors();
      return getDoctors(filters);
    }

    let doctors: PrivateDoctor[] = JSON.parse(data);

    // 应用筛选
    if (filters) {
      if (filters.department) {
        doctors = doctors.filter((d) => d.department === filters.department);
      }
      if (filters.hospitalLevel) {
        doctors = doctors.filter((d) => d.hospital.level === filters.hospitalLevel);
      }
      if (filters.isOnline !== undefined) {
        doctors = doctors.filter((d) => d.isOnline === filters.isOnline);
      }
      if (filters.hasOverseasTraining) {
        doctors = doctors.filter((d) => d.overseasTraining.length > 0);
      }
      if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
        doctors = doctors.filter((d) => {
          const minPackagePrice = Math.min(...d.packages.map((p) => p.price));
          if (filters.minPrice !== undefined && minPackagePrice < filters.minPrice) return false;
          if (filters.maxPrice !== undefined && minPackagePrice > filters.maxPrice) return false;
          return true;
        });
      }
    }

    return doctors;
  } catch (error) {
    console.error('获取医生列表失败:', error);
    return [];
  }
};

/**
 * 根据ID获取医生详情
 */
export const getDoctorById = async (doctorId: string): Promise<PrivateDoctor | null> => {
  try {
    const doctors = await getDoctors();
    return doctors.find((d) => d.id === doctorId) || null;
  } catch (error) {
    console.error('获取医生详情失败:', error);
    return null;
  }
};

/**
 * 签约医生
 */
export const subscribeToDoctor = async (
  userId: string,
  doctorId: string,
  packageId: string,
  paymentInfo: {
    amount: number;
    method: string;
    transactionId: string;
  }
): Promise<DoctorSubscription | null> => {
  try {
    const doctor = await getDoctorById(doctorId);
    if (!doctor) {
      throw new Error('医生不存在');
    }

    const selectedPackage = doctor.packages.find((p) => p.id === packageId);
    if (!selectedPackage) {
      throw new Error('套餐不存在');
    }

    // 计算结束日期（1年后）
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1);

    const subscription: DoctorSubscription = {
      id: `sub_${Date.now()}`,
      userId,
      doctorId,
      packageId,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      status: SubscriptionStatus.ACTIVE,
      remainingServices: { ...selectedPackage.services },
      payment: {
        ...paymentInfo,
        paidAt: new Date().toISOString(),
      },
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 如果是高级套餐，分配健康管家
    if (selectedPackage.level === PackageLevel.PREMIUM || selectedPackage.level === PackageLevel.VIP_FAMILY) {
      subscription.healthManager = {
        id: `manager_${Date.now()}`,
        name: '专属健康管家',
        avatar: '👩‍⚕️',
        phone: '400-888-6666',
        background: '资深医疗背景，5年健康管理经验',
      };
    }

    // 如果提供医生直线
    if (selectedPackage.doctorDirectLine) {
      subscription.doctorDirectLine = '400-888-8888';
    }

    // 设置续约提醒（到期前30天）
    const reminderDate = new Date(endDate);
    reminderDate.setDate(reminderDate.getDate() - 30);
    subscription.renewalReminder = {
      reminderDate: reminderDate.toISOString().split('T')[0],
      reminded: false,
    };

    // 创建订单记录
    const getPackageLevelLabel = (level: PackageLevel): string => {
      const labels: Record<PackageLevel, string> = {
        [PackageLevel.BASIC]: '基础版',
        [PackageLevel.STANDARD]: '标准版',
        [PackageLevel.PREMIUM]: '尊享版',
        [PackageLevel.VIP_FAMILY]: 'VIP家庭版',
      };
      return labels[level];
    };

    await createPrivateDoctorOrder({
      userId,
      doctorId,
      doctorName: doctor.name,
      packageName: getPackageLevelLabel(selectedPackage.level),
      packageLevel: selectedPackage.level,
      price: paymentInfo.amount,
      subscriptionId: subscription.id,
      startDate: subscription.startDate,
      endDate: subscription.endDate,
      subscription, // 传递完整的订阅对象
    });

    return subscription;
  } catch (error) {
    console.error('签约医生失败:', error);
    return null;
  }
};

/**
 * 获取我的签约信息 - 从订单数据中读取
 */
export const getMySubscription = async (userId: string): Promise<DoctorSubscription | null> => {
  try {
    console.log('🔍 getMySubscription: 从订单中查找用户签约, userId:', userId);

    const orders = await getOrders();
    console.log('📦 getMySubscription: 订单总数:', orders.length);

    // 查找该用户的私人医生订单（包括 paid 和 cancelled 状态）
    const privateDoctorOrder = orders.find(
      order =>
        order.userId === userId &&
        order.itemType === 'private_doctor' &&
        (order.status === 'paid' || order.status === 'cancelled')
    );

    if (!privateDoctorOrder) {
      console.log('❌ getMySubscription: 未找到私人医生签约订单');
      return null;
    }

    console.log('✅ getMySubscription: 找到订单', privateDoctorOrder.id, '状态:', privateDoctorOrder.status);

    // 从 metadata.subscription 读取完整签约对象
    if (privateDoctorOrder.metadata?.subscription) {
      const subscription = privateDoctorOrder.metadata.subscription;
      // 同步订单状态到签约状态
      subscription.status = privateDoctorOrder.status === 'paid' ? 'active' : 'cancelled';
      console.log('✅ getMySubscription: 从 metadata.subscription 读取签约数据');
      return subscription;
    }

    console.log('❌ getMySubscription: metadata.subscription 不存在，签约数据缺失');
    return null;
  } catch (error) {
    console.error('❌ getMySubscription 失败:', error);
    return null;
  }
};

/**
 * 获取用户所有私人医生签约 - 支持多个签约
 */
export const getAllMySubscriptions = async (userId: string): Promise<DoctorSubscription[]> => {
  try {
    console.log('🔍 getAllMySubscriptions: 从订单中查找用户所有签约, userId:', userId);

    const orders = await getOrders();
    console.log('📦 getAllMySubscriptions: 订单总数:', orders.length);

    // 查找该用户所有的私人医生订单（仅 paid 状态）
    const privateDoctorOrders = orders.filter(
      (order: any) =>
        order.userId === userId &&
        order.itemType === 'private_doctor' &&
        order.status === 'paid'
    );

    if (privateDoctorOrders.length === 0) {
      console.log('❌ getAllMySubscriptions: 未找到私人医生签约订单');
      return [];
    }

    console.log('✅ getAllMySubscriptions: 找到', privateDoctorOrders.length, '个有效签约');

    // 从每个订单中提取签约信息
    const subscriptions: DoctorSubscription[] = [];
    for (const order of privateDoctorOrders) {
      if (order.metadata?.subscription) {
        const subscription = order.metadata.subscription;
        subscription.status = 'active';
        subscriptions.push(subscription);
      }
    }

    return subscriptions;
  } catch (error) {
    console.error('❌ getAllMySubscriptions 失败:', error);
    return [];
  }
};

/**
 * 取消签约 - 只更新订单数据
 */
export const cancelSubscription = async (subscriptionId: string): Promise<boolean> => {
  try {
    console.log('📦 cancelSubscription: 取消签约, subscriptionId:', subscriptionId);

    const orders = await getOrders();
    console.log('📦 cancelSubscription: 订单总数:', orders.length);

    let foundOrder = false;
    const updatedOrders = orders.map((order: any) => {
      console.log(`📦 检查订单 ${order.id}: itemType=${order.itemType}, metadata.subscriptionId=${order.metadata?.subscriptionId}`);

      if (
        order.itemType === 'private_doctor' &&
        order.metadata?.subscriptionId === subscriptionId
      ) {
        foundOrder = true;
        console.log(`✅ 找到匹配订单 ${order.id}，更新状态为 cancelled`);

        // 更新签约对象状态（如果存在）
        const updatedSubscription = order.metadata.subscription
          ? {
              ...order.metadata.subscription,
              status: SubscriptionStatus.CANCELLED,
              updatedAt: new Date().toISOString(),
            }
          : undefined;

        return {
          ...order,
          status: 'cancelled',
          metadata: {
            ...order.metadata,
            subscription: updatedSubscription,
            cancelledAt: new Date().toISOString(),
            cancellationReason: '用户主动取消签约',
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    });

    if (!foundOrder) {
      console.warn(`⚠️ 未找到 subscriptionId=${subscriptionId} 对应的订单`);
      return false;
    }

    // 保存更新后的订单列表（保存完整的 OrderList 结构）
    const orderList = {
      orders: updatedOrders,
      lastModified: new Date().toISOString(),
    };
    await AsyncStorage.setItem('@kangyang_orders', JSON.stringify(orderList));
    console.log('✅ 订单状态已更新并保存');

    return true;
  } catch (error) {
    console.error('❌ cancelSubscription 失败:', error);
    return false;
  }
};

/**
 * 续约 - 只更新订单数据
 */
export const renewSubscription = async (
  subscriptionId: string,
  paymentInfo: {
    amount: number;
    method: string;
    transactionId: string;
  }
): Promise<boolean> => {
  try {
    console.log('📦 renewSubscription: 续约, subscriptionId:', subscriptionId);

    const orders = await getOrders();
    console.log('📦 renewSubscription: 订单总数:', orders.length);

    let foundOrder = false;
    const updatedOrders = orders.map((order: any) => {
      if (
        order.itemType === 'private_doctor' &&
        order.metadata?.subscriptionId === subscriptionId
      ) {
        foundOrder = true;
        console.log(`✅ 找到匹配订单 ${order.id}，执行续订`);

        // 延长1年
        const currentEndDate = new Date(order.metadata.endDate || order.metadata.subscription?.endDate);
        const newEndDate = new Date(currentEndDate);
        newEndDate.setFullYear(newEndDate.getFullYear() + 1);
        const newEndDateStr = newEndDate.toISOString().split('T')[0];

        // 更新签约对象（如果存在）
        const updatedSubscription = order.metadata.subscription
          ? {
              ...order.metadata.subscription,
              endDate: newEndDateStr,
              status: SubscriptionStatus.ACTIVE,
              payment: {
                ...paymentInfo,
                paidAt: new Date().toISOString(),
              },
              updatedAt: new Date().toISOString(),
              renewalReminder: {
                reminderDate: new Date(newEndDate.getTime() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                reminded: false,
              },
            }
          : undefined;

        return {
          ...order,
          status: 'paid', // 续订后恢复为 paid 状态
          metadata: {
            ...order.metadata,
            endDate: newEndDateStr,
            subscription: updatedSubscription,
            renewedAt: new Date().toISOString(),
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    });

    if (!foundOrder) {
      console.warn(`⚠️ 未找到 subscriptionId=${subscriptionId} 对应的订单`);
      return false;
    }

    // 保存更新后的订单列表（保存完整的 OrderList 结构）
    const orderList = {
      orders: updatedOrders,
      lastModified: new Date().toISOString(),
    };
    await AsyncStorage.setItem('@kangyang_orders', JSON.stringify(orderList));
    console.log('✅ 订单续订成功并保存');

    return true;
  } catch (error) {
    console.error('❌ renewSubscription 失败:', error);
    return false;
  }
};

// ==================== 问诊相关操作（预留接口）====================

/**
 * 创建问诊记录
 */
export const createConsultation = async (
  consultationData: Omit<ConsultationRecord, 'id' | 'createdAt' | 'updatedAt'>
): Promise<ConsultationRecord | null> => {
  try {
    const consultation: ConsultationRecord = {
      ...consultationData,
      id: `consult_${Date.now()}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // 读取现有记录
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS);
    const records: ConsultationRecord[] = data ? JSON.parse(data) : [];

    records.unshift(consultation); // 新记录在前

    await AsyncStorage.setItem(
      PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS,
      JSON.stringify(records)
    );

    // 扣减签约服务次数
    await deductServiceUsage(consultationData.subscriptionId, consultationData.type);

    return consultation;
  } catch (error) {
    console.error('创建问诊记录失败:', error);
    return null;
  }
};

/**
 * 扣减服务使用次数 - 更新订单中的签约数据
 */
const deductServiceUsage = async (
  subscriptionId: string,
  consultationType: ConsultationType
): Promise<void> => {
  try {
    console.log('📦 deductServiceUsage: 扣减服务次数, subscriptionId:', subscriptionId);

    const orders = await getOrders();

    const updatedOrders = orders.map((order: any) => {
      if (
        order.itemType === 'private_doctor' &&
        order.metadata?.subscriptionId === subscriptionId &&
        order.metadata?.subscription
      ) {
        const subscription = order.metadata.subscription;

        // 根据类型扣减
        switch (consultationType) {
          case ConsultationType.ONLINE_CHAT:
            if (subscription.remainingServices.onlineConsultations > 0) {
              subscription.remainingServices.onlineConsultations--;
            }
            break;
          case ConsultationType.VIDEO:
            if (subscription.remainingServices.videoConsults > 0) {
              subscription.remainingServices.videoConsults--;
            }
            break;
          case ConsultationType.PHONE:
            if (subscription.remainingServices.phoneConsults > 0) {
              subscription.remainingServices.phoneConsults--;
            }
            break;
          case ConsultationType.IN_PERSON:
            if (subscription.remainingServices.inPersonVisits > 0) {
              subscription.remainingServices.inPersonVisits--;
            }
            break;
          case ConsultationType.HOME_VISIT:
            if (subscription.remainingServices.homeVisits > 0) {
              subscription.remainingServices.homeVisits--;
            }
            break;
        }

        subscription.updatedAt = new Date().toISOString();

        return {
          ...order,
          metadata: {
            ...order.metadata,
            subscription,
          },
          updatedAt: new Date().toISOString(),
        };
      }
      return order;
    });

    // 保存更新后的订单列表（保存完整的 OrderList 结构）
    const orderList = {
      orders: updatedOrders,
      lastModified: new Date().toISOString(),
    };
    await AsyncStorage.setItem('@kangyang_orders', JSON.stringify(orderList));
    console.log('✅ deductServiceUsage: 服务次数已扣减并保存');
  } catch (error) {
    console.error('❌ deductServiceUsage 失败:', error);
  }
};

/**
 * 获取问诊记录列表
 */
export const getConsultations = async (
  userId: string,
  filters?: {
    type?: ConsultationType;
    status?: ConsultationStatus;
    startDate?: string;
    endDate?: string;
  }
): Promise<ConsultationRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS);
    if (!data) return [];

    let records: ConsultationRecord[] = JSON.parse(data);

    // 只返回当前用户的记录
    records = records.filter((r) => r.userId === userId);

    // 应用筛选
    if (filters) {
      if (filters.type) {
        records = records.filter((r) => r.type === filters.type);
      }
      if (filters.status) {
        records = records.filter((r) => r.status === filters.status);
      }
      // 日期筛选可在这里添加
    }

    return records;
  } catch (error) {
    console.error('获取问诊记录失败:', error);
    return [];
  }
};

/**
 * 获取单条问诊记录
 */
export const getConsultationById = async (consultationId: string): Promise<ConsultationRecord | null> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS);
    if (!data) return null;

    const records: ConsultationRecord[] = JSON.parse(data);
    return records.find((r) => r.id === consultationId) || null;
  } catch (error) {
    console.error('获取问诊记录失败:', error);
    return null;
  }
};

// ==================== 健康档案管理 ====================

/**
 * 创建或更新健康档案
 */
export const upsertHealthRecord = async (record: MedicalHealthRecord): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.HEALTH_RECORDS);
    let records: MedicalHealthRecord[] = data ? JSON.parse(data) : [];

    const existingIndex = records.findIndex((r) => r.id === record.id);
    if (existingIndex >= 0) {
      records[existingIndex] = { ...record, updatedAt: new Date().toISOString() };
    } else {
      records.push({ ...record, createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() });
    }

    await AsyncStorage.setItem(PRIVATE_DOCTOR_STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(records));
    console.log('✅ 健康档案保存成功:', record.id);
    return true;
  } catch (error) {
    console.error('保存健康档案失败:', error);
    return false;
  }
};

/**
 * 获取用户的健康档案（包括家庭成员）
 */
export const getHealthRecords = async (userId: string, subscriptionId?: string): Promise<MedicalHealthRecord[]> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.HEALTH_RECORDS);
    if (!data) return [];

    let records: MedicalHealthRecord[] = JSON.parse(data);

    // 筛选属于该用户的档案
    records = records.filter((r) => r.userId === userId);

    // 如果指定了签约ID，只返回该签约相关的档案
    if (subscriptionId) {
      records = records.filter((r) => r.subscriptionId === subscriptionId);
    }

    return records;
  } catch (error) {
    console.error('获取健康档案失败:', error);
    return [];
  }
};

/**
 * 获取单个健康档案
 */
export const getHealthRecordById = async (recordId: string): Promise<MedicalHealthRecord | null> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.HEALTH_RECORDS);
    if (!data) return null;

    const records: MedicalHealthRecord[] = JSON.parse(data);
    return records.find((r) => r.id === recordId) || null;
  } catch (error) {
    console.error('获取健康档案失败:', error);
    return null;
  }
};

/**
 * 删除健康档案
 */
export const deleteHealthRecord = async (recordId: string): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.HEALTH_RECORDS);
    if (!data) return false;

    let records: MedicalHealthRecord[] = JSON.parse(data);
    records = records.filter((r) => r.id !== recordId);

    await AsyncStorage.setItem(PRIVATE_DOCTOR_STORAGE_KEYS.HEALTH_RECORDS, JSON.stringify(records));
    console.log('✅ 健康档案删除成功:', recordId);
    return true;
  } catch (error) {
    console.error('删除健康档案失败:', error);
    return false;
  }
};

// ==================== 补充缺失的服务函数 ====================

/**
 * 获取医生空闲时段
 */
export const getDoctorAvailability = async (
  doctorId: string,
  date: string
): Promise<{ time: string; available: boolean }[]> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock数据 - 生成当天的时间段
  const timeSlots = [];
  const hours = ['09:00', '10:00', '11:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

  for (const hour of hours) {
    timeSlots.push({
      time: hour,
      available: Math.random() > 0.3, // 随机可用性
    });
  }

  return timeSlots;
};

/**
 * 更新问诊记录
 */
export const updateConsultation = async (
  id: string,
  data: Partial<ConsultationRecord>
): Promise<boolean> => {
  try {
    const storageData = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS);
    if (!storageData) return false;

    let records: ConsultationRecord[] = JSON.parse(storageData);
    const index = records.findIndex((r) => r.id === id);

    if (index === -1) return false;

    records[index] = { ...records[index], ...data, updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS, JSON.stringify(records));

    console.log('✅ 问诊记录更新成功:', id);
    return true;
  } catch (error) {
    console.error('更新问诊记录失败:', error);
    return false;
  }
};

/**
 * 预约问诊
 */
export const bookAppointment = async (appointmentData: {
  userId: string;
  doctorId: string;
  subscriptionId: string;
  type: ConsultationType;
  scheduledDate: string;
  scheduledTime: string;
  chiefComplaint: string;
}): Promise<ConsultationRecord | null> => {
  try {
    const newConsultation: ConsultationRecord = {
      id: `cons_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: appointmentData.userId,
      doctorId: appointmentData.doctorId,
      subscriptionId: appointmentData.subscriptionId,
      type: appointmentData.type,
      scheduledDate: appointmentData.scheduledDate,
      scheduledTime: appointmentData.scheduledTime,
      status: 'scheduled',
      chiefComplaint: appointmentData.chiefComplaint,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const data = await AsyncStorage.getItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS);
    const records: ConsultationRecord[] = data ? JSON.parse(data) : [];
    records.push(newConsultation);

    await AsyncStorage.setItem(PRIVATE_DOCTOR_STORAGE_KEYS.CONSULTATION_RECORDS, JSON.stringify(records));
    console.log('✅ 预约问诊成功:', newConsultation.id);
    return newConsultation;
  } catch (error) {
    console.error('预约问诊失败:', error);
    return null;
  }
};

/**
 * 取消预约
 */
export const cancelAppointment = async (appointmentId: string): Promise<boolean> => {
  return await updateConsultation(appointmentId, { status: 'cancelled' });
};

/**
 * 评价问诊
 */
export const rateConsultation = async (
  consultationId: string,
  rating: { score: number; comment: string }
): Promise<boolean> => {
  return await updateConsultation(consultationId, { rating });
};

/**
 * 创建健康评估
 */
export const createHealthAssessment = async (assessmentData: {
  userId: string;
  subscriptionId: string;
  overallScore: number;
  systemScores: Record<string, number>;
  riskFactors: string[];
  recommendations: string[];
}): Promise<any> => {
  try {
    const assessment = {
      id: `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...assessmentData,
      createdAt: new Date().toISOString(),
    };

    const data = await AsyncStorage.getItem('health_assessments');
    const assessments = data ? JSON.parse(data) : [];
    assessments.push(assessment);

    await AsyncStorage.setItem('health_assessments', JSON.stringify(assessments));
    console.log('✅ 健康评估创建成功:', assessment.id);
    return assessment;
  } catch (error) {
    console.error('创建健康评估失败:', error);
    return null;
  }
};

/**
 * 获取评估列表
 */
export const getHealthAssessments = async (userId: string): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem('health_assessments');
    if (!data) return [];

    const assessments = JSON.parse(data);
    return assessments.filter((a: any) => a.userId === userId);
  } catch (error) {
    console.error('获取评估列表失败:', error);
    return [];
  }
};

/**
 * 获取最新评估
 */
export const getLatestAssessment = async (userId: string): Promise<any | null> => {
  const assessments = await getHealthAssessments(userId);
  if (assessments.length === 0) return null;

  return assessments.sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )[0];
};

/**
 * 创建健康计划
 */
export const createHealthPlan = async (planData: {
  userId: string;
  subscriptionId: string;
  type: string;
  title: string;
  goals: any[];
  startDate: string;
  endDate: string;
}): Promise<any> => {
  try {
    const plan = {
      id: `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...planData,
      status: 'active',
      progress: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    const data = await AsyncStorage.getItem('health_plans');
    const plans = data ? JSON.parse(data) : [];
    plans.push(plan);

    await AsyncStorage.setItem('health_plans', JSON.stringify(plans));
    console.log('✅ 健康计划创建成功:', plan.id);
    return plan;
  } catch (error) {
    console.error('创建健康计划失败:', error);
    return null;
  }
};

/**
 * 获取健康计划
 */
export const getHealthPlans = async (userId: string): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem('health_plans');
    if (!data) return [];

    const plans = JSON.parse(data);
    return plans.filter((p: any) => p.userId === userId);
  } catch (error) {
    console.error('获取健康计划失败:', error);
    return [];
  }
};

/**
 * 更新计划
 */
export const updateHealthPlan = async (
  planId: string,
  updates: Partial<any>
): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem('health_plans');
    if (!data) return false;

    let plans = JSON.parse(data);
    const index = plans.findIndex((p: any) => p.id === planId);

    if (index === -1) return false;

    plans[index] = { ...plans[index], ...updates, updatedAt: new Date().toISOString() };
    await AsyncStorage.setItem('health_plans', JSON.stringify(plans));

    console.log('✅ 健康计划更新成功:', planId);
    return true;
  } catch (error) {
    console.error('更新健康计划失败:', error);
    return false;
  }
};

/**
 * 记录计划进度
 */
export const recordPlanProgress = async (
  planId: string,
  progressData: { metrics: any[]; notes?: string }
): Promise<boolean> => {
  try {
    const data = await AsyncStorage.getItem('health_plans');
    if (!data) return false;

    let plans = JSON.parse(data);
    const plan = plans.find((p: any) => p.id === planId);

    if (!plan) return false;

    if (!plan.progressRecords) {
      plan.progressRecords = [];
    }

    plan.progressRecords.push({
      date: new Date().toISOString(),
      ...progressData,
    });

    await AsyncStorage.setItem('health_plans', JSON.stringify(plans));
    console.log('✅ 计划进度记录成功:', planId);
    return true;
  } catch (error) {
    console.error('记录计划进度失败:', error);
    return false;
  }
};

/**
 * 申请专家会诊
 */
export const requestExpertConsultation = async (requestData: {
  userId: string;
  caseDescription: string;
  preferredDepartment?: string;
  urgency: 'normal' | 'urgent' | 'emergency';
}): Promise<any> => {
  try {
    const request = {
      id: `expert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const data = await AsyncStorage.getItem('expert_consultations');
    const requests = data ? JSON.parse(data) : [];
    requests.push(request);

    await AsyncStorage.setItem('expert_consultations', JSON.stringify(requests));
    console.log('✅ 专家会诊申请成功:', request.id);
    return request;
  } catch (error) {
    console.error('申请专家会诊失败:', error);
    return null;
  }
};

/**
 * 获取会诊申请
 */
export const getConsultationRequests = async (userId: string): Promise<any[]> => {
  try {
    const data = await AsyncStorage.getItem('expert_consultations');
    if (!data) return [];

    const requests = JSON.parse(data);
    return requests.filter((r: any) => r.userId === userId);
  } catch (error) {
    console.error('获取会诊申请失败:', error);
    return [];
  }
};

/**
 * 申请绿色通道
 */
export const requestGreenChannel = async (requestData: {
  userId: string;
  serviceType: 'appointment' | 'hospitalization' | 'examination';
  hospital: string;
  department: string;
  urgency: 'normal' | 'urgent';
}): Promise<any> => {
  try {
    const request = {
      id: `green_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const data = await AsyncStorage.getItem('green_channel_requests');
    const requests = data ? JSON.parse(data) : [];
    requests.push(request);

    await AsyncStorage.setItem('green_channel_requests', JSON.stringify(requests));
    console.log('✅ 绿色通道申请成功:', request.id);
    return request;
  } catch (error) {
    console.error('申请绿色通道失败:', error);
    return null;
  }
};

/**
 * 申请国际转诊
 */
export const requestInternationalReferral = async (requestData: {
  userId: string;
  diseaseType: string;
  hospitalId: string;
  budgetRange?: string;
}): Promise<any> => {
  try {
    const request = {
      id: `intl_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ...requestData,
      status: 'pending',
      submittedAt: new Date().toISOString(),
    };

    const data = await AsyncStorage.getItem('international_referrals');
    const requests = data ? JSON.parse(data) : [];
    requests.push(request);

    await AsyncStorage.setItem('international_referrals', JSON.stringify(requests));
    console.log('✅ 国际转诊申请成功:', request.id);
    return request;
  } catch (error) {
    console.error('申请国际转诊失败:', error);
    return null;
  }
};

/**
 * 获取健康管家信息
 */
export const getHealthManagerInfo = async (subscriptionId: string): Promise<any> => {
  await new Promise((resolve) => setTimeout(resolve, 300));

  // Mock健康管家数据
  return {
    id: 'manager_001',
    name: '李静',
    title: '高级健康管家',
    avatar: 'https://via.placeholder.com/100',
    phone: '138****8888',
    wechat: 'healthmanager_lj',
    experience: '8年医疗服务经验',
    rating: 4.9,
    servicesCount: 127,
  };
};

// ==================== 导出所有服务 ====================

const privateDoctorService = {
  // 初始化
  initializePrivateDoctors,
  initializeMockSubscription,

  // 医生管理
  getDoctors,
  getDoctorById,
  getDoctorAvailability,

  // 签约管理
  subscribeToDoctor,
  getMySubscription,
  getAllMySubscriptions,
  cancelSubscription,
  renewSubscription,

  // 问诊管理
  createConsultation,
  getConsultations,
  getConsultationById,
  updateConsultation,
  bookAppointment,
  cancelAppointment,
  rateConsultation,

  // 健康档案管理
  upsertHealthRecord,
  getHealthRecords,
  getHealthRecordById,
  deleteHealthRecord,

  // 健康评估
  createHealthAssessment,
  getHealthAssessments,
  getLatestAssessment,

  // 健康计划
  createHealthPlan,
  getHealthPlans,
  updateHealthPlan,
  recordPlanProgress,

  // 高级服务
  requestExpertConsultation,
  getConsultationRequests,
  requestGreenChannel,
  requestInternationalReferral,
  getHealthManagerInfo,
};

export { privateDoctorService };
export default privateDoctorService;
