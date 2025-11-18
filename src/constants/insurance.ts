/**
 * 保险规划模块常量配置
 * Insurance Planning Module Constants
 */

import { InsuranceCategory, ArticleCategory } from '@/types/insurance';

// ==================== 保险类别配置 ====================

/**
 * 保险类别标签映射
 */
export const INSURANCE_CATEGORY_LABELS: Record<InsuranceCategory, string> = {
  medical: '医疗险',
  critical_illness: '重疾险',
  annuity: '年金险',
  life: '寿险',
  accident: '意外险',
  long_term_care: '长期护理险',
  wealth_inheritance: '财富传承',
};

/**
 * 保险类别图标映射
 */
export const INSURANCE_CATEGORY_ICONS: Record<InsuranceCategory, string> = {
  medical: 'activity',
  critical_illness: 'heart',
  annuity: 'trending-up',
  life: 'shield',
  accident: 'alert-circle',
  long_term_care: 'users',
  wealth_inheritance: 'briefcase',
};

/**
 * 保险类别颜色映射
 */
export const INSURANCE_CATEGORY_COLORS: Record<InsuranceCategory, string> = {
  medical: '#3B82F6', // 蓝色
  critical_illness: '#EF4444', // 红色
  annuity: '#10B981', // 绿色
  life: '#8B5CF6', // 紫色
  accident: '#F59E0B', // 橙色
  long_term_care: '#EC4899', // 粉色
  wealth_inheritance: '#6366F1', // 靛蓝色
};

/**
 * 保险类别描述
 */
export const INSURANCE_CATEGORY_DESCRIPTIONS: Record<InsuranceCategory, string> = {
  medical: '报销医疗费用，减轻就医负担',
  critical_illness: '重大疾病一次性赔付，保障康复费用',
  annuity: '养老储蓄规划，退休生活保障',
  life: '身故保障，守护家人未来',
  accident: '意外伤害保障，应对突发风险',
  long_term_care: '失能护理保障，晚年生活无忧',
  wealth_inheritance: '大额寿险，财富传承规划',
};

// ==================== 保险产品标签 ====================

/**
 * 产品特色标签配置
 */
export const PRODUCT_FEATURE_LABELS = {
  no_medical_exam: '免体检',
  fast_claim: '快速理赔',
  guaranteed_renewal: '保证续保',
  high_value: '高性价比',
  big_company: '大公司',
  specialized: '专业化',
};

/**
 * 产品特色标签颜色
 */
export const PRODUCT_FEATURE_COLORS = {
  no_medical_exam: '#10B981',
  fast_claim: '#3B82F6',
  guaranteed_renewal: '#8B5CF6',
  high_value: '#F59E0B',
  big_company: '#EF4444',
  specialized: '#EC4899',
};

/**
 * 年龄段标签
 */
export const AGE_GROUP_LABELS = {
  '50-60': '50-60岁',
  '60-70': '60-70岁',
  '70+': '70岁以上',
  all: '全年龄段',
};

/**
 * 健康状况标签
 */
export const HEALTH_STATUS_LABELS = {
  standard: '标准体',
  subhealth: '亚健康',
  chronic_disease: '慢病可投',
};

// ==================== 咨询服务配置 ====================

/**
 * 咨询类型标签
 */
export const CONSULTATION_TYPE_LABELS = {
  text: '图文咨询',
  phone: '电话咨询',
  video: '视频咨询',
  home_visit: '上门服务',
};

/**
 * 咨询类型图标
 */
export const CONSULTATION_TYPE_ICONS = {
  text: 'message-square',
  phone: 'phone',
  video: 'video',
  home_visit: 'home',
};

/**
 * 咨询状态标签
 */
export const CONSULTATION_STATUS_LABELS = {
  pending: '待回复',
  replied: '已回复',
  completed: '已完成',
  cancelled: '已取消',
};

/**
 * 咨询状态颜色
 */
export const CONSULTATION_STATUS_COLORS = {
  pending: '#F59E0B',
  replied: '#3B82F6',
  completed: '#10B981',
  cancelled: '#6B7280',
};

// ==================== AI 规划配置 ====================

/**
 * 保障需求标签
 */
export const COVERAGE_NEED_LABELS = {
  medical: '医疗保障',
  critical_illness: '重疾保障',
  pension: '养老规划',
  inheritance: '财富传承',
  accident: '意外防护',
};

/**
 * 风险偏好标签
 */
export const RISK_PREFERENCE_LABELS = {
  conservative: '保守型',
  balanced: '稳健型',
  aggressive: '激进型',
};

/**
 * 方案等级标签
 */
export const PLAN_TIER_LABELS = {
  basic: '基础版',
  standard: '标准版',
  premium: '尊享版',
};

/**
 * 方案等级描述
 */
export const PLAN_TIER_DESCRIPTIONS = {
  basic: '基础保障，经济实惠',
  standard: '全面保障，性价比高',
  premium: '顶级保障，无忧无虑',
};

/**
 * 核保结论标签
 */
export const UNDERWRITING_CONCLUSION_LABELS = {
  standard: '标准体承保',
  extra_premium: '加费承保',
  exclusion: '除外承保',
  declined: '拒保',
};

/**
 * 核保结论颜色
 */
export const UNDERWRITING_CONCLUSION_COLORS = {
  standard: '#10B981',
  extra_premium: '#F59E0B',
  exclusion: '#EF4444',
  declined: '#6B7280',
};

// ==================== 保单管理配置 ====================

/**
 * 保单状态标签
 */
export const POLICY_STATUS_LABELS = {
  active: '正常',
  lapsed: '失效',
  claiming: '理赔中',
  claimed: '已理赔',
  surrendered: '已退保',
};

/**
 * 保单状态颜色
 */
export const POLICY_STATUS_COLORS = {
  active: '#10B981',
  lapsed: '#6B7280',
  claiming: '#3B82F6',
  claimed: '#8B5CF6',
  surrendered: '#EF4444',
};

// ==================== 理赔协助配置 ====================

/**
 * 理赔类型标签
 */
export const CLAIM_TYPE_LABELS = {
  illness: '疾病',
  accident: '意外',
  medical: '医疗',
  death: '身故',
};

/**
 * 理赔协助状态标签
 */
export const CLAIM_ASSISTANCE_STATUS_LABELS = {
  submitted: '已提交',
  reviewing: '审核中',
  additional_materials_needed: '需补充材料',
  completed: '已完成',
};

/**
 * 理赔协助状态颜色
 */
export const CLAIM_ASSISTANCE_STATUS_COLORS = {
  submitted: '#3B82F6',
  reviewing: '#F59E0B',
  additional_materials_needed: '#EF4444',
  completed: '#10B981',
};

// ==================== 知识库配置 ====================

/**
 * 文章分类标签
 */
export const ARTICLE_CATEGORY_LABELS: Record<ArticleCategory, string> = {
  basics: '保险科普',
  product_review: '产品解读',
  claim_guide: '理赔指南',
  pitfall_avoidance: '防坑避雷',
};

/**
 * 视频分类标签
 */
export const VIDEO_CATEGORY_LABELS = {
  basics: '保险基础',
  product_test: '产品测评',
  claim_practice: '理赔实战',
};

/**
 * 问答分类标签
 */
export const QA_CATEGORY_LABELS = {
  product_consultation: '产品咨询',
  claim_help: '理赔求助',
  purchase_question: '投保疑问',
};

// ==================== 筛选配置 ====================

/**
 * 产品筛选选项 - 险种
 */
export const PRODUCT_FILTER_CATEGORIES = [
  { id: 'all', label: '全部险种' },
  { id: 'medical', label: '医疗险' },
  { id: 'critical_illness', label: '重疾险' },
  { id: 'annuity', label: '年金险' },
  { id: 'life', label: '寿险' },
  { id: 'accident', label: '意外险' },
  { id: 'long_term_care', label: '长期护理险' },
  { id: 'wealth_inheritance', label: '财富传承' },
];

/**
 * 产品排序选项
 */
export const PRODUCT_SORT_OPTIONS = [
  { id: 'recommended', label: '综合推荐' },
  { id: 'sales', label: '销量优先' },
  { id: 'price_low', label: '价格从低到高' },
  { id: 'price_high', label: '价格从高到低' },
  { id: 'rating', label: '好评优先' },
];

/**
 * 顾问筛选选项 - 专业领域
 */
export const ADVISOR_SPECIALTY_OPTIONS = [
  { id: 'all', label: '全部领域' },
  { id: 'pension_planning', label: '养老规划' },
  { id: 'medical_insurance', label: '医疗险配置' },
  { id: 'wealth_inheritance', label: '高净值传承' },
  { id: 'critical_illness', label: '重疾险规划' },
  { id: 'family_protection', label: '家庭保障' },
];

/**
 * 顾问排序选项
 */
export const ADVISOR_SORT_OPTIONS = [
  { id: 'recommended', label: '综合推荐' },
  { id: 'satisfaction', label: '好评优先' },
  { id: 'response_time', label: '响应速度' },
  { id: 'experience', label: '从业年限' },
];

// ==================== 快速入口配置 ====================

/**
 * 首页快速入口
 */
export const HOME_QUICK_ENTRIES = [
  {
    id: 'ai_planning',
    label: 'AI规划',
    description: '智能分析保障需求',
    icon: 'cpu',
    color: '#3B82F6',
    route: 'AIPlannerWizard',
  },
  {
    id: 'hot_products',
    label: '产品推荐',
    description: '精选热销保险',
    icon: 'star',
    color: '#F59E0B',
    route: 'InsuranceProductList',
  },
  {
    id: 'my_policies',
    label: '我的保单',
    description: '管理已有保单',
    icon: 'file-text',
    color: '#10B981',
    route: 'MyInsurancePolicies',
  },
  {
    id: 'consult_advisor',
    label: '咨询顾问',
    description: '专业顾问免费咨询',
    icon: 'message-circle',
    color: '#8B5CF6',
    route: 'InsuranceAdvisorList',
  },
];

// ==================== 其他配置 ====================

/**
 * 默认分页大小
 */
export const DEFAULT_PAGE_SIZE = 10;

/**
 * 产品对比最大数量
 */
export const MAX_COMPARISON_PRODUCTS = 3;

/**
 * 文件上传最大大小 (10MB)
 */
export const MAX_FILE_SIZE = 10 * 1024 * 1024;

/**
 * 支持的文件类型
 */
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/jpg',
  'application/pdf',
];

/**
 * 免责声明文本
 */
export const DISCLAIMER_TEXT = `
重要提示：

1. 本平台仅提供保险产品信息展示和专业咨询服务，不直接销售保险产品。

2. 所有保险产品的购买需通过保险公司官方渠道或合作经纪平台完成。

3. 产品信息仅供参考，具体保障责任、投保规则以保险公司官方条款为准。

4. AI规划结果仅作为参考建议，不构成投保建议，实际投保请咨询专业顾问。

5. 理赔协助服务仅提供咨询指导，不承担理赔成功的保证责任。

6. 用户提供的个人健康信息将严格保密，仅用于规划分析，不会用于其他用途。
`;

/**
 * 咨询服务说明
 */
export const CONSULTATION_SERVICE_DESCRIPTION = `
我们提供完全免费的保险咨询服务：

✓ AI智能规划 - 无限次使用，快速分析保障需求
✓ 图文咨询 - 专业顾问在线解答，24小时内回复
✓ 电话咨询 - 一对一深度沟通，解决复杂问题
✓ 视频咨询 - 面对面交流，清晰展示产品细节
✓ 上门服务 - 预约顾问上门，提供便捷服务

所有咨询服务完全免费，无需购买会员。
`;
