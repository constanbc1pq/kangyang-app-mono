/**
 * 风险预警服务
 * 提供风险行为记录、风险分析、合同审查、法律体检等功能
 */

import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  RiskAlert,
  LegalCheckup,
  LEGAL_SERVICE_STORAGE_KEYS,
} from '../types/legalService';

/**
 * 风险行为类型枚举
 */
export enum RiskBehaviorType {
  // 财产风险
  LARGE_TRANSACTION = 'large_transaction', // 大额交易
  PROPERTY_TRANSFER = 'property_transfer', // 财产转移
  DEBT_INCREASE = 'debt_increase', // 负债增加

  // 合同风险
  CONTRACT_SIGNING = 'contract_signing', // 合同签署
  INVESTMENT = 'investment', // 投资活动
  LOAN = 'loan', // 贷款

  // 健康风险
  HOSPITALIZATION = 'hospitalization', // 住院治疗
  MAJOR_ILLNESS = 'major_illness', // 重大疾病

  // 社交风险
  NEW_RELATIONSHIP = 'new_relationship', // 新认识的人
  FREQUENT_CONTACT = 'frequent_contact', // 频繁接触陌生人

  // 其他风险
  FRAUD_ATTEMPT = 'fraud_attempt', // 疑似诈骗
  UNUSUAL_REQUEST = 'unusual_request', // 异常请求
}

/**
 * 风险等级枚举
 */
export enum RiskLevel {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

/**
 * 风险行为数据接口
 */
export interface RiskBehaviorData {
  type: RiskBehaviorType;
  description: string;
  amount?: number; // 涉及金额
  relatedParty?: string; // 相关方
  date: string;
  evidence?: string[]; // 证据（图片、文件等）
  notes?: string;
}

/**
 * 风险分析结果接口
 */
export interface RiskAnalysisResult {
  userId: string;
  analyzedAt: string;
  overallRisk: RiskLevel;
  riskScore: number; // 0-100
  riskFactors: RiskFactor[];
  recommendations: string[];
  alerts: RiskAlert[];
}

/**
 * 风险因素接口
 */
export interface RiskFactor {
  type: string;
  level: RiskLevel;
  description: string;
  impact: number; // 影响程度 0-100
}

/**
 * 合同审查数据接口
 */
export interface ContractReviewData {
  title: string;
  content: string;
  contractType?: string;
  parties?: string[];
  amount?: number;
  fileUri?: string;
}

/**
 * 合同审查结果接口
 */
export interface ContractReviewResult {
  id: string;
  userId: string;
  contractData: ContractReviewData;
  reviewedAt: string;
  riskLevel: RiskLevel;
  issues: ContractIssue[];
  suggestions: string[];
  score: number; // 合同安全评分 0-100
}

/**
 * 合同问题接口
 */
export interface ContractIssue {
  type: 'missing_clause' | 'unfair_term' | 'legal_risk' | 'unclear_wording';
  severity: RiskLevel;
  description: string;
  location?: string; // 问题所在位置
  suggestion: string; // 修改建议
}

/**
 * 提交风险行为
 */
export const submitRiskBehavior = async (
  userId: string,
  behaviorData: RiskBehaviorData
): Promise<void> => {
  try {
    const storageKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_risk_behaviors`;
    const data = await AsyncStorage.getItem(storageKey);
    const behaviors: Array<RiskBehaviorData & { userId: string; submittedAt: string }> = data
      ? JSON.parse(data)
      : [];

    behaviors.push({
      userId,
      ...behaviorData,
      submittedAt: new Date().toISOString(),
    });

    await AsyncStorage.setItem(storageKey, JSON.stringify(behaviors));
    console.log(`用户 ${userId} 提交风险行为: ${behaviorData.type}`);

    // 触发风险分析
    await analyzeRisk(userId);
  } catch (error) {
    console.error('Error submitting risk behavior:', error);
    throw error;
  }
};

/**
 * 风险分析
 */
export const analyzeRisk = async (userId: string): Promise<RiskAnalysisResult> => {
  try {
    // 获取用户的风险行为
    const storageKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_risk_behaviors`;
    const data = await AsyncStorage.getItem(storageKey);
    const allBehaviors: Array<RiskBehaviorData & { userId: string; submittedAt: string }> = data
      ? JSON.parse(data)
      : [];

    const userBehaviors = allBehaviors.filter(b => b.userId === userId);

    // 分析风险因素
    const riskFactors: RiskFactor[] = [];
    let totalRiskScore = 0;

    // 财产风险分析
    const propertyRisks = userBehaviors.filter(
      b =>
        b.type === RiskBehaviorType.LARGE_TRANSACTION ||
        b.type === RiskBehaviorType.PROPERTY_TRANSFER ||
        b.type === RiskBehaviorType.DEBT_INCREASE
    );

    if (propertyRisks.length > 0) {
      const totalAmount = propertyRisks.reduce((sum, r) => sum + (r.amount || 0), 0);
      const impact = Math.min(100, (totalAmount / 100000) * 20); // 每10万元增加20分影响

      let level = RiskLevel.LOW;
      if (impact > 60) level = RiskLevel.HIGH;
      else if (impact > 30) level = RiskLevel.MEDIUM;

      riskFactors.push({
        type: '财产风险',
        level,
        description: `近期涉及大额财产交易 ¥${totalAmount.toLocaleString()}`,
        impact,
      });

      totalRiskScore += impact;
    }

    // 合同风险分析
    const contractRisks = userBehaviors.filter(
      b =>
        b.type === RiskBehaviorType.CONTRACT_SIGNING ||
        b.type === RiskBehaviorType.INVESTMENT ||
        b.type === RiskBehaviorType.LOAN
    );

    if (contractRisks.length > 0) {
      const impact = Math.min(100, contractRisks.length * 15);

      let level = RiskLevel.LOW;
      if (impact > 45) level = RiskLevel.HIGH;
      else if (impact > 30) level = RiskLevel.MEDIUM;

      riskFactors.push({
        type: '合同风险',
        level,
        description: `近期签署 ${contractRisks.length} 份合同或协议`,
        impact,
      });

      totalRiskScore += impact;
    }

    // 诈骗风险分析
    const fraudRisks = userBehaviors.filter(
      b => b.type === RiskBehaviorType.FRAUD_ATTEMPT || b.type === RiskBehaviorType.UNUSUAL_REQUEST
    );

    if (fraudRisks.length > 0) {
      const impact = Math.min(100, fraudRisks.length * 30);
      const level = impact > 60 ? RiskLevel.CRITICAL : RiskLevel.HIGH;

      riskFactors.push({
        type: '诈骗风险',
        level,
        description: `检测到 ${fraudRisks.length} 次疑似诈骗行为`,
        impact,
      });

      totalRiskScore += impact;
    }

    // 计算总体风险等级
    const avgRiskScore = riskFactors.length > 0 ? totalRiskScore / riskFactors.length : 0;
    let overallRisk = RiskLevel.LOW;
    if (avgRiskScore > 70) overallRisk = RiskLevel.CRITICAL;
    else if (avgRiskScore > 50) overallRisk = RiskLevel.HIGH;
    else if (avgRiskScore > 30) overallRisk = RiskLevel.MEDIUM;

    // 生成建议
    const recommendations: string[] = [];
    if (propertyRisks.length > 0) {
      recommendations.push('建议制作或更新遗嘱，明确财产分配意愿');
      recommendations.push('建议进行财产公证，确保财产安全');
    }
    if (contractRisks.length > 0) {
      recommendations.push('建议聘请律师审查合同条款');
      recommendations.push('谨慎投资，避免高风险理财产品');
    }
    if (fraudRisks.length > 0) {
      recommendations.push('立即停止与可疑人员的接触');
      recommendations.push('联系家人或律师咨询');
      recommendations.push('保留证据，必要时报警');
    }

    // 生成风险预警
    const alerts: RiskAlert[] = riskFactors
      .filter(rf => rf.level === RiskLevel.HIGH || rf.level === RiskLevel.CRITICAL)
      .map(rf => ({
        id: `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        userId,
        type: rf.type as any,
        level: rf.level,
        title: `${rf.type}预警`,
        description: rf.description,
        recommendations: recommendations.slice(0, 2),
        createdAt: new Date().toISOString(),
        isRead: false,
      }));

    // 保存预警
    if (alerts.length > 0) {
      const alertsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_risk_alerts`;
      const existingAlerts = await AsyncStorage.getItem(alertsKey);
      const allAlerts: RiskAlert[] = existingAlerts ? JSON.parse(existingAlerts) : [];
      allAlerts.push(...alerts);
      await AsyncStorage.setItem(alertsKey, JSON.stringify(allAlerts));
    }

    const result: RiskAnalysisResult = {
      userId,
      analyzedAt: new Date().toISOString(),
      overallRisk,
      riskScore: avgRiskScore,
      riskFactors,
      recommendations,
      alerts,
    };

    return result;
  } catch (error) {
    console.error('Error analyzing risk:', error);
    throw error;
  }
};

/**
 * 获取风险预警
 */
export const getRiskAlerts = async (userId: string): Promise<RiskAlert[]> => {
  try {
    const alertsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_risk_alerts`;
    const data = await AsyncStorage.getItem(alertsKey);

    if (!data) {
      return [];
    }

    const allAlerts: RiskAlert[] = JSON.parse(data);
    return allAlerts.filter(alert => alert.userId === userId).sort((a, b) =>
      new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );
  } catch (error) {
    console.error('Error getting risk alerts:', error);
    return [];
  }
};

/**
 * 标记预警为已读
 */
export const markAlertAsRead = async (alertId: string): Promise<void> => {
  try {
    const alertsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_risk_alerts`;
    const data = await AsyncStorage.getItem(alertsKey);

    if (!data) {
      return;
    }

    const alerts: RiskAlert[] = JSON.parse(data);
    const alert = alerts.find(a => a.id === alertId);

    if (alert) {
      alert.isRead = true;
      await AsyncStorage.setItem(alertsKey, JSON.stringify(alerts));
    }
  } catch (error) {
    console.error('Error marking alert as read:', error);
  }
};

/**
 * 合同审查
 */
export const reviewContract = async (
  userId: string,
  contractData: ContractReviewData
): Promise<ContractReviewResult> => {
  try {
    // 简化的合同审查逻辑（实际应该调用AI API）
    const issues: ContractIssue[] = [];
    let score = 100;

    // 检查基本要素
    if (!contractData.parties || contractData.parties.length < 2) {
      issues.push({
        type: 'missing_clause',
        severity: RiskLevel.HIGH,
        description: '合同缺少必要的当事人信息',
        suggestion: '补充完整的甲乙双方信息，包括姓名、身份证号、联系方式',
      });
      score -= 20;
    }

    if (!contractData.amount || contractData.amount === 0) {
      issues.push({
        type: 'missing_clause',
        severity: RiskLevel.MEDIUM,
        description: '合同未明确约定金额',
        suggestion: '明确标注合同涉及金额及支付方式',
      });
      score -= 10;
    }

    // 检查常见风险条款
    const content = contractData.content.toLowerCase();
    if (content.includes('不可撤销') || content.includes('不可更改')) {
      issues.push({
        type: 'unfair_term',
        severity: RiskLevel.HIGH,
        description: '发现可能不利的不可撤销条款',
        suggestion: '建议修改为可在特定条件下变更或撤销',
      });
      score -= 15;
    }

    if (!content.includes('违约') && !content.includes('breach')) {
      issues.push({
        type: 'missing_clause',
        severity: RiskLevel.MEDIUM,
        description: '合同缺少违约责任条款',
        suggestion: '增加违约责任及赔偿标准的约定',
      });
      score -= 10;
    }

    if (!content.includes('争议') && !content.includes('仲裁') && !content.includes('诉讼')) {
      issues.push({
        type: 'missing_clause',
        severity: RiskLevel.LOW,
        description: '合同缺少争议解决条款',
        suggestion: '增加争议解决方式（仲裁或诉讼）及管辖法院',
      });
      score -= 5;
    }

    // 确定风险等级
    let riskLevel = RiskLevel.LOW;
    if (score < 60) riskLevel = RiskLevel.HIGH;
    else if (score < 80) riskLevel = RiskLevel.MEDIUM;

    // 生成建议
    const suggestions: string[] = [
      '建议由专业律师进行详细审查',
      '签署前请仔细阅读所有条款',
      '保留合同副本及相关证据',
    ];

    if (riskLevel === RiskLevel.HIGH) {
      suggestions.unshift('发现较多风险条款，强烈建议修改后再签署');
    }

    const result: ContractReviewResult = {
      id: `review_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      contractData,
      reviewedAt: new Date().toISOString(),
      riskLevel,
      issues,
      suggestions,
      score: Math.max(0, score),
    };

    // 保存审查记录
    const reviewsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_contract_reviews`;
    const data = await AsyncStorage.getItem(reviewsKey);
    const reviews: ContractReviewResult[] = data ? JSON.parse(data) : [];
    reviews.push(result);
    await AsyncStorage.setItem(reviewsKey, JSON.stringify(reviews));

    return result;
  } catch (error) {
    console.error('Error reviewing contract:', error);
    throw error;
  }
};

/**
 * 法律体检
 */
export const performLegalCheckup = async (userId: string): Promise<LegalCheckup> => {
  try {
    // 执行综合法律风险分析
    const riskAnalysis = await analyzeRisk(userId);

    // 检查遗嘱状态
    // 检查监护协议状态
    // 检查财产清单状态
    // 检查合同审查历史
    // ... 等等

    const checkup: LegalCheckup = {
      id: `checkup_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId,
      performedAt: new Date().toISOString(),
      overallScore: Math.max(0, 100 - riskAnalysis.riskScore),
      riskLevel: riskAnalysis.overallRisk,
      issues: riskAnalysis.riskFactors.map(rf => ({
        category: rf.type,
        severity: rf.level,
        description: rf.description,
        suggestion: '请及时采取措施降低风险',
      })),
      recommendations: riskAnalysis.recommendations,
      nextCheckupDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90天后
    };

    // 保存体检记录
    const checkupsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_legal_checkups`;
    const data = await AsyncStorage.getItem(checkupsKey);
    const checkups: LegalCheckup[] = data ? JSON.parse(data) : [];
    checkups.push(checkup);
    await AsyncStorage.setItem(checkupsKey, JSON.stringify(checkups));

    return checkup;
  } catch (error) {
    console.error('Error performing legal checkup:', error);
    throw error;
  }
};

/**
 * 获取法律体检历史
 */
export const getLegalCheckupHistory = async (userId: string): Promise<LegalCheckup[]> => {
  try {
    const checkupsKey = `${LEGAL_SERVICE_STORAGE_KEYS.WILLS}_legal_checkups`;
    const data = await AsyncStorage.getItem(checkupsKey);

    if (!data) {
      return [];
    }

    const allCheckups: LegalCheckup[] = JSON.parse(data);
    return allCheckups
      .filter(checkup => checkup.userId === userId)
      .sort((a, b) => new Date(b.performedAt).getTime() - new Date(a.performedAt).getTime());
  } catch (error) {
    console.error('Error getting legal checkup history:', error);
    return [];
  }
};

export default {
  submitRiskBehavior,
  analyzeRisk,
  getRiskAlerts,
  markAlertAsRead,
  reviewContract,
  performLegalCheckup,
  getLegalCheckupHistory,
};
