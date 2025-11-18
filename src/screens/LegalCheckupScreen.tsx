/**
 * ============================================================================
 * 法律体检页面 - LegalCheckupScreen
 * ============================================================================
 *
 * Phase 35.3: 法律体检
 *
 * 【功能概述】
 * - 为老年人提供全面的法律风险评估服务
 * - 识别法律保障方面的薄弱环节
 *
 * 【主要功能】
 * 1. 体检问卷：涵盖遗嘱、财产、赡养等方面
 * 2. 风险评估：AI算法分析风险等级
 * 3. 体检报告：详细展示风险点和改进建议
 * 4. 一键解决：直接跳转到相应服务
 *
 * ============================================================================
 */

import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface Props {
  navigation: any;
}

// 问卷题目
interface Question {
  id: string;
  category: string;
  question: string;
  options: { value: string; label: string; score: number }[];
}

// 问卷答案
type Answers = Record<string, string>;

// 风险领域
interface RiskArea {
  category: string;
  score: number;
  level: 'safe' | 'warning' | 'danger';
  issues: string[];
  suggestions: string[];
  action?: { label: string; screen: string };
}

// 体检步骤
type CheckupStep = 'intro' | 'questionnaire' | 'analyzing' | 'report';

const LegalCheckupScreen: React.FC<Props> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<CheckupStep>('intro');
  const [answers, setAnswers] = useState<Answers>({});
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [riskAreas, setRiskAreas] = useState<RiskArea[]>([]);

  // 问卷题目
  const questions: Question[] = [
    {
      id: 'q1',
      category: '遗嘱规划',
      question: '您是否已经订立了遗嘱？',
      options: [
        { value: 'yes_notarized', label: '是，已公证', score: 0 },
        { value: 'yes_not_notarized', label: '是，未公证', score: 30 },
        { value: 'no', label: '否', score: 80 },
      ],
    },
    {
      id: 'q2',
      category: '遗嘱规划',
      question: '您的遗嘱内容是否涵盖了所有重要财产？',
      options: [
        { value: 'yes', label: '是', score: 0 },
        { value: 'partial', label: '部分涵盖', score: 40 },
        { value: 'no', label: '否/未订立遗嘱', score: 80 },
      ],
    },
    {
      id: 'q3',
      category: '财产管理',
      question: '您的主要财产（房产、存款等）是否有清晰的记录？',
      options: [
        { value: 'yes', label: '是，有详细记录', score: 0 },
        { value: 'partial', label: '有部分记录', score: 40 },
        { value: 'no', label: '否，没有记录', score: 70 },
      ],
    },
    {
      id: 'q4',
      category: '财产管理',
      question: '您是否有贵重物品（珠宝、收藏品等）未明确归属？',
      options: [
        { value: 'no', label: '否，都已明确', score: 0 },
        { value: 'few', label: '有少量', score: 30 },
        { value: 'many', label: '有较多', score: 60 },
      ],
    },
    {
      id: 'q5',
      category: '赡养安排',
      question: '您与子女之间是否有明确的赡养约定？',
      options: [
        { value: 'yes_written', label: '是，有书面协议', score: 0 },
        { value: 'yes_verbal', label: '是，有口头约定', score: 40 },
        { value: 'no', label: '否，没有约定', score: 70 },
      ],
    },
    {
      id: 'q6',
      category: '赡养安排',
      question: '目前您的赡养状况如何？',
      options: [
        { value: 'good', label: '很好，子女主动照顾', score: 0 },
        { value: 'normal', label: '一般，基本能照顾', score: 30 },
        { value: 'poor', label: '不好，很少照顾', score: 80 },
      ],
    },
    {
      id: 'q7',
      category: '监护安排',
      question: '您是否指定了意定监护人？',
      options: [
        { value: 'yes', label: '是，已指定并公证', score: 0 },
        { value: 'partial', label: '考虑中，未正式指定', score: 50 },
        { value: 'no', label: '否，不了解这项制度', score: 70 },
      ],
    },
    {
      id: 'q8',
      category: '合同风险',
      question: '最近一年，您签署合同前是否咨询过律师？',
      options: [
        { value: 'always', label: '总是咨询', score: 0 },
        { value: 'sometimes', label: '有时咨询', score: 40 },
        { value: 'never', label: '从不咨询', score: 80 },
      ],
    },
    {
      id: 'q9',
      category: '防骗意识',
      question: '您是否了解常见的养老诈骗手段？',
      options: [
        { value: 'very_well', label: '非常了解', score: 0 },
        { value: 'some', label: '了解一些', score: 30 },
        { value: 'not_much', label: '不太了解', score: 70 },
      ],
    },
    {
      id: 'q10',
      category: '法律储备',
      question: '遇到法律问题时，您是否知道如何寻求帮助？',
      options: [
        { value: 'yes', label: '是，知道途径', score: 0 },
        { value: 'partial', label: '部分知道', score: 40 },
        { value: 'no', label: '否，不太清楚', score: 70 },
      ],
    },
  ];

  // 分析风险
  const analyzeRisks = () => {
    setCurrentStep('analyzing');

    setTimeout(() => {
      const categoryScores: Record<string, number[]> = {};

      // 计算各类别得分
      questions.forEach(q => {
        const answer = answers[q.id];
        if (answer) {
          const option = q.options.find(opt => opt.value === answer);
          if (option) {
            if (!categoryScores[q.category]) {
              categoryScores[q.category] = [];
            }
            categoryScores[q.category].push(option.score);
          }
        }
      });

      // 生成风险领域报告
      const risks: RiskArea[] = [];

      // 遗嘱规划
      const willScore =
        categoryScores['遗嘱规划']?.reduce((a, b) => a + b, 0) /
        (categoryScores['遗嘱规划']?.length || 1);
      risks.push({
        category: '遗嘱规划',
        score: willScore,
        level: willScore < 30 ? 'safe' : willScore < 60 ? 'warning' : 'danger',
        issues:
          willScore >= 60
            ? ['尚未订立遗嘱', '财产分配不明确', '可能引发继承纠纷']
            : willScore >= 30
            ? ['遗嘱未公证', '部分财产未纳入遗嘱']
            : ['遗嘱规划完善'],
        suggestions:
          willScore >= 60
            ? ['立即订立遗嘱', '明确财产分配方案', '考虑公证遗嘱']
            : willScore >= 30
            ? ['建议对遗嘱进行公证', '补充遗漏财产']
            : ['定期更新遗嘱内容'],
        action:
          willScore >= 30
            ? { label: '立即订立遗嘱', screen: 'WillCreator' }
            : undefined,
      });

      // 财产管理
      const propertyScore =
        categoryScores['财产管理']?.reduce((a, b) => a + b, 0) /
        (categoryScores['财产管理']?.length || 1);
      risks.push({
        category: '财产管理',
        score: propertyScore,
        level: propertyScore < 30 ? 'safe' : propertyScore < 60 ? 'warning' : 'danger',
        issues:
          propertyScore >= 60
            ? ['财产登记不清晰', '贵重物品归属不明', '容易产生争议']
            : propertyScore >= 30
            ? ['部分财产未登记', '需要完善财产清单']
            : ['财产管理规范'],
        suggestions:
          propertyScore >= 60
            ? ['建立财产清单', '明确贵重物品归属', '定期更新记录']
            : propertyScore >= 30
            ? ['补充财产登记', '整理贵重物品清单']
            : ['保持良好的财产管理习惯'],
        action:
          propertyScore >= 30
            ? { label: '建立财产清单', screen: 'PropertyInventory' }
            : undefined,
      });

      // 赡养安排
      const supportScore =
        categoryScores['赡养安排']?.reduce((a, b) => a + b, 0) /
        (categoryScores['赡养安排']?.length || 1);
      risks.push({
        category: '赡养安排',
        score: supportScore,
        level: supportScore < 30 ? 'safe' : supportScore < 60 ? 'warning' : 'danger',
        issues:
          supportScore >= 60
            ? ['缺乏赡养约定', '赡养状况不理想', '可能存在赡养纠纷']
            : supportScore >= 30
            ? ['仅有口头约定', '需要书面化']
            : ['赡养安排合理'],
        suggestions:
          supportScore >= 60
            ? ['与子女签订赡养协议', '必要时寻求法律帮助']
            : supportScore >= 30
            ? ['将口头约定书面化', '明确赡养责任']
            : ['保持良好的家庭关系'],
        action:
          supportScore >= 30
            ? { label: '咨询律师', screen: 'LawyerList' }
            : undefined,
      });

      // 监护安排
      const guardianshipScore =
        categoryScores['监护安排']?.reduce((a, b) => a + b, 0) /
        (categoryScores['监护安排']?.length || 1);
      risks.push({
        category: '监护安排',
        score: guardianshipScore,
        level:
          guardianshipScore < 30 ? 'safe' : guardianshipScore < 60 ? 'warning' : 'danger',
        issues:
          guardianshipScore >= 60
            ? ['未指定意定监护人', '失能后缺乏保障']
            : guardianshipScore >= 30
            ? ['监护安排不完善']
            : ['监护安排完善'],
        suggestions:
          guardianshipScore >= 60
            ? ['了解意定监护制度', '指定可信赖的监护人', '签订监护协议']
            : guardianshipScore >= 30
            ? ['完善监护安排', '考虑公证']
            : ['定期确认监护人意愿'],
        action:
          guardianshipScore >= 30
            ? { label: '设立意定监护', screen: 'GuardianshipCreator' }
            : undefined,
      });

      // 其他风险
      const otherCategories = ['合同风险', '防骗意识', '法律储备'];
      otherCategories.forEach(category => {
        const score =
          categoryScores[category]?.reduce((a, b) => a + b, 0) /
          (categoryScores[category]?.length || 1);
        if (score !== undefined) {
          risks.push({
            category,
            score,
            level: score < 30 ? 'safe' : score < 60 ? 'warning' : 'danger',
            issues: score >= 60 ? [`${category}需要加强`] : score >= 30 ? [`${category}有待提升`] : [`${category}良好`],
            suggestions:
              score >= 60
                ? [`学习${category}相关知识`, '提高防范意识']
                : score >= 30
                ? [`继续提升${category}`]
                : ['保持良好习惯'],
          });
        }
      });

      setRiskAreas(risks);
      setCurrentStep('report');
    }, 2000);
  };

  // 渲染介绍页
  const renderIntro = () => {
    return (
      <ScrollView style={styles.introContainer} showsVerticalScrollIndicator={false}>
        <View style={styles.introHeader}>
          <View style={styles.introIconContainer}>
            <Ionicons name="medical" size={60} color="#1890ff" />
          </View>
          <Text style={styles.introTitle}>法律体检</Text>
          <Text style={styles.introSubtitle}>全面评估您的法律风险</Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.introSectionTitle}>什么是法律体检？</Text>
          <Text style={styles.introText}>
            法律体检是对您在遗嘱、财产、赡养、监护等方面的法律保障状况进行全面评估，帮助您及时发现法律风险，提前做好预防和规划。
          </Text>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.introSectionTitle}>体检包含哪些内容？</Text>
          <View style={styles.checkItemsList}>
            {[
              { icon: 'document-text', label: '遗嘱规划', description: '遗嘱订立和更新情况' },
              { icon: 'wallet', label: '财产管理', description: '财产登记和保护状况' },
              { icon: 'heart', label: '赡养安排', description: '赡养协议和执行情况' },
              { icon: 'people', label: '监护安排', description: '意定监护设立情况' },
              { icon: 'shield-checkmark', label: '法律意识', description: '防骗和维权能力' },
            ].map((item, index) => (
              <View key={index} style={styles.checkItem}>
                <View style={styles.checkItemIcon}>
                  <Ionicons name={item.icon as any} size={24} color="#1890ff" />
                </View>
                <View style={styles.checkItemContent}>
                  <Text style={styles.checkItemLabel}>{item.label}</Text>
                  <Text style={styles.checkItemDescription}>{item.description}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.introSection}>
          <Text style={styles.introSectionTitle}>体检需要多长时间？</Text>
          <Text style={styles.introText}>
            本次体检共{questions.length}道题，大约需要5分钟完成。请根据实际情况如实作答，以便获得准确的评估结果。
          </Text>
        </View>

        <TouchableOpacity
          style={styles.startButton}
          onPress={() => {
            setCurrentStep('questionnaire');
            setCurrentQuestionIndex(0);
          }}
        >
          <Text style={styles.startButtonText}>开始体检</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>
    );
  };

  // 渲染问卷
  const renderQuestionnaire = () => {
    const question = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    return (
      <View style={styles.questionnaireContainer}>
        {/* 进度条 */}
        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${progress}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentQuestionIndex + 1} / {questions.length}
          </Text>
        </View>

        {/* 问题 */}
        <ScrollView style={styles.questionContent} showsVerticalScrollIndicator={false}>
          <View style={styles.categoryTag}>
            <Text style={styles.categoryTagText}>{question.category}</Text>
          </View>

          <Text style={styles.questionText}>{question.question}</Text>

          <View style={styles.optionsContainer}>
            {question.options.map(option => {
              const isSelected = answers[question.id] === option.value;
              return (
                <TouchableOpacity
                  key={option.value}
                  style={[styles.optionCard, isSelected && styles.optionCardSelected]}
                  onPress={() => {
                    setAnswers({ ...answers, [question.id]: option.value });
                  }}
                >
                  <View
                    style={[
                      styles.optionRadio,
                      isSelected && styles.optionRadioSelected,
                    ]}
                  >
                    {isSelected && <View style={styles.optionRadioDot} />}
                  </View>
                  <Text
                    style={[
                      styles.optionText,
                      isSelected && styles.optionTextSelected,
                    ]}
                  >
                    {option.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        {/* 导航按钮 */}
        <View style={styles.questionnaireNav}>
          {currentQuestionIndex > 0 && (
            <TouchableOpacity
              style={styles.prevButton}
              onPress={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
            >
              <Ionicons name="arrow-back" size={20} color="#666" />
              <Text style={styles.prevButtonText}>上一题</Text>
            </TouchableOpacity>
          )}

          <TouchableOpacity
            style={[
              styles.nextButton,
              !answers[question.id] && styles.nextButtonDisabled,
              currentQuestionIndex === 0 && styles.nextButtonFull,
            ]}
            onPress={() => {
              if (!answers[question.id]) {
                Alert.alert('提示', '请选择一个选项');
                return;
              }

              if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(currentQuestionIndex + 1);
              } else {
                analyzeRisks();
              }
            }}
            disabled={!answers[question.id]}
          >
            <Text style={styles.nextButtonText}>
              {currentQuestionIndex === questions.length - 1 ? '完成体检' : '下一题'}
            </Text>
            <Ionicons name="arrow-forward" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  // 渲染分析中
  const renderAnalyzing = () => {
    return (
      <View style={styles.analyzingContainer}>
        <Ionicons name="analytics" size={80} color="#1890ff" />
        <Text style={styles.analyzingTitle}>正在生成体检报告...</Text>
        <Text style={styles.analyzingText}>AI正在分析您的法律风险状况</Text>
      </View>
    );
  };

  // 渲染报告
  const renderReport = () => {
    const dangerCount = riskAreas.filter(r => r.level === 'danger').length;
    const warningCount = riskAreas.filter(r => r.level === 'warning').length;
    const safeCount = riskAreas.filter(r => r.level === 'safe').length;

    const overallLevel =
      dangerCount > 0 ? 'danger' : warningCount > 2 ? 'warning' : 'safe';

    return (
      <ScrollView style={styles.reportContainer} showsVerticalScrollIndicator={false}>
        {/* 总体评估 */}
        <View style={styles.overallSection}>
          <View
            style={[
              styles.overallBadge,
              {
                backgroundColor:
                  overallLevel === 'danger'
                    ? '#ff4d4f'
                    : overallLevel === 'warning'
                    ? '#faad14'
                    : '#52c41a',
              },
            ]}
          >
            <Ionicons
              name={
                overallLevel === 'danger'
                  ? 'warning'
                  : overallLevel === 'warning'
                  ? 'alert-circle'
                  : 'checkmark-circle'
              }
              size={60}
              color="#fff"
            />
          </View>
          <Text style={styles.overallTitle}>
            {overallLevel === 'danger'
              ? '风险较高'
              : overallLevel === 'warning'
              ? '存在风险'
              : '整体良好'}
          </Text>
          <Text style={styles.overallDescription}>
            {overallLevel === 'danger'
              ? '发现多处法律风险，建议尽快采取措施'
              : overallLevel === 'warning'
              ? '部分方面需要完善，建议逐步改进'
              : '法律保障较为完善，请继续保持'}
          </Text>

          <View style={styles.overallStats}>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatNumber}>{dangerCount}</Text>
              <Text style={[styles.overallStatLabel, { color: '#ff4d4f' }]}>
                高风险
              </Text>
            </View>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatNumber}>{warningCount}</Text>
              <Text style={[styles.overallStatLabel, { color: '#faad14' }]}>
                中风险
              </Text>
            </View>
            <View style={styles.overallStatItem}>
              <Text style={styles.overallStatNumber}>{safeCount}</Text>
              <Text style={[styles.overallStatLabel, { color: '#52c41a' }]}>
                安全
              </Text>
            </View>
          </View>
        </View>

        {/* 风险详情 */}
        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>详细评估</Text>
          {riskAreas.map((area, index) => (
            <View key={index} style={styles.riskAreaCard}>
              <View style={styles.riskAreaHeader}>
                <Text style={styles.riskAreaTitle}>{area.category}</Text>
                <View
                  style={[
                    styles.riskLevelBadge,
                    {
                      backgroundColor:
                        area.level === 'danger'
                          ? '#fff1f0'
                          : area.level === 'warning'
                          ? '#fffbe6'
                          : '#f6ffed',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.riskLevelText,
                      {
                        color:
                          area.level === 'danger'
                            ? '#ff4d4f'
                            : area.level === 'warning'
                            ? '#faad14'
                            : '#52c41a',
                      },
                    ]}
                  >
                    {area.level === 'danger'
                      ? '需改进'
                      : area.level === 'warning'
                      ? '待提升'
                      : '良好'}
                  </Text>
                </View>
              </View>

              <View style={styles.riskAreaContent}>
                <Text style={styles.riskAreaLabel}>发现问题：</Text>
                {area.issues.map((issue, i) => (
                  <Text key={i} style={styles.riskAreaIssue}>
                    • {issue}
                  </Text>
                ))}
              </View>

              <View style={styles.riskAreaContent}>
                <Text style={styles.riskAreaLabel}>改进建议：</Text>
                {area.suggestions.map((suggestion, i) => (
                  <Text key={i} style={styles.riskAreaSuggestion}>
                    • {suggestion}
                  </Text>
                ))}
              </View>

              {area.action && (
                <TouchableOpacity
                  style={styles.actionButton}
                  onPress={() => {
                    navigation.navigate(area.action!.screen);
                  }}
                >
                  <Text style={styles.actionButtonText}>{area.action.label}</Text>
                  <Ionicons name="arrow-forward" size={16} color="#1890ff" />
                </TouchableOpacity>
              )}
            </View>
          ))}
        </View>

        {/* 总结建议 */}
        <View style={styles.reportSection}>
          <Text style={styles.reportSectionTitle}>总结与建议</Text>
          <View style={styles.summaryCard}>
            <Ionicons name="bulb" size={24} color="#faad14" />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryText}>
                {overallLevel === 'danger'
                  ? '建议您优先解决高风险问题，如订立遗嘱、建立财产清单、设立意定监护等。必要时可咨询专业律师获取帮助。'
                  : overallLevel === 'warning'
                  ? '您的法律保障整体尚可，建议逐步完善各项安排，如公证遗嘱、书面化赡养协议等，提升法律保障水平。'
                  : '您的法律保障非常完善！建议定期（每年1-2次）进行法律体检，及时更新相关文件，保持良好状态。'}
              </Text>
            </View>
          </View>
        </View>

        {/* 操作按钮 */}
        <View style={styles.reportActions}>
          <TouchableOpacity
            style={styles.consultLawyerButton}
            onPress={() => navigation.navigate('LawyerList')}
          >
            <Ionicons name="people" size={20} color="#fff" />
            <Text style={styles.consultLawyerButtonText}>咨询律师</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.redoButton}
            onPress={() => {
              setCurrentStep('intro');
              setAnswers({});
              setCurrentQuestionIndex(0);
              setRiskAreas([]);
            }}
          >
            <Ionicons name="refresh" size={20} color="#1890ff" />
            <Text style={styles.redoButtonText}>重新体检</Text>
          </TouchableOpacity>
        </View>

        <View style={{ height: 20 }} />
      </ScrollView>
    );
  };

  return (
    <View style={styles.container}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>法律体检</Text>
        <View style={{ width: 40 }} />
      </View>

      {/* 内容 */}
      {currentStep === 'intro' && renderIntro()}
      {currentStep === 'questionnaire' && renderQuestionnaire()}
      {currentStep === 'analyzing' && renderAnalyzing()}
      {currentStep === 'report' && renderReport()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  introContainer: {
    flex: 1,
    padding: 20,
  },
  introHeader: {
    alignItems: 'center',
    marginBottom: 32,
  },
  introIconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  introSubtitle: {
    fontSize: 15,
    color: '#666',
  },
  introSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
  },
  introSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  introText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  checkItemsList: {
    gap: 12,
  },
  checkItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  checkItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#e6f7ff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkItemContent: {
    flex: 1,
  },
  checkItemLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 2,
  },
  checkItemDescription: {
    fontSize: 13,
    color: '#999',
  },
  startButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#1890ff',
    borderRadius: 24,
    gap: 8,
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  questionnaireContainer: {
    flex: 1,
  },
  progressContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  progressBar: {
    height: 6,
    backgroundColor: '#f0f0f0',
    borderRadius: 3,
    marginBottom: 8,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#1890ff',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  questionContent: {
    flex: 1,
    padding: 20,
  },
  categoryTag: {
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#e6f7ff',
    borderRadius: 12,
    marginBottom: 20,
  },
  categoryTagText: {
    fontSize: 13,
    color: '#1890ff',
    fontWeight: '500',
  },
  questionText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    lineHeight: 28,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#f0f0f0',
  },
  optionCardSelected: {
    borderColor: '#1890ff',
    backgroundColor: '#e6f7ff',
  },
  optionRadio: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#d9d9d9',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  optionRadioSelected: {
    borderColor: '#1890ff',
  },
  optionRadioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1890ff',
  },
  optionText: {
    flex: 1,
    fontSize: 15,
    color: '#666',
  },
  optionTextSelected: {
    color: '#1890ff',
    fontWeight: '500',
  },
  questionnaireNav: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    gap: 12,
  },
  prevButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#f0f0f0',
    borderRadius: 24,
    gap: 6,
  },
  prevButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
  },
  nextButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#1890ff',
    borderRadius: 24,
    gap: 6,
  },
  nextButtonFull: {
    flex: 2,
  },
  nextButtonDisabled: {
    backgroundColor: '#d9d9d9',
  },
  nextButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  analyzingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  analyzingTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginTop: 24,
    marginBottom: 8,
  },
  analyzingText: {
    fontSize: 14,
    color: '#999',
  },
  reportContainer: {
    flex: 1,
  },
  overallSection: {
    backgroundColor: '#fff',
    padding: 32,
    alignItems: 'center',
    borderBottomWidth: 8,
    borderBottomColor: '#f5f5f5',
  },
  overallBadge: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  overallTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  overallDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
  },
  overallStats: {
    flexDirection: 'row',
    gap: 32,
  },
  overallStatItem: {
    alignItems: 'center',
  },
  overallStatNumber: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 4,
  },
  overallStatLabel: {
    fontSize: 13,
    fontWeight: '500',
  },
  reportSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 8,
  },
  reportSectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 16,
  },
  riskAreaCard: {
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  riskAreaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  riskAreaTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  riskLevelBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  riskLevelText: {
    fontSize: 12,
    fontWeight: '600',
  },
  riskAreaContent: {
    marginBottom: 12,
  },
  riskAreaLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
  },
  riskAreaIssue: {
    fontSize: 14,
    color: '#ff4d4f',
    lineHeight: 22,
  },
  riskAreaSuggestion: {
    fontSize: 14,
    color: '#52c41a',
    lineHeight: 22,
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#1890ff',
    gap: 6,
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1890ff',
  },
  summaryCard: {
    flexDirection: 'row',
    padding: 16,
    backgroundColor: '#fffbe6',
    borderRadius: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#faad14',
    gap: 12,
  },
  summaryContent: {
    flex: 1,
  },
  summaryText: {
    fontSize: 14,
    color: '#666',
    lineHeight: 24,
  },
  reportActions: {
    flexDirection: 'row',
    gap: 12,
    padding: 16,
    backgroundColor: '#fff',
  },
  consultLawyerButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#1890ff',
    borderRadius: 24,
    gap: 6,
  },
  consultLawyerButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#fff',
  },
  redoButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    backgroundColor: '#fff',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#1890ff',
    gap: 6,
  },
  redoButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1890ff',
  },
});

export default LegalCheckupScreen;
