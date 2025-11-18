import React, { useState, useEffect } from 'react';
import { ScrollView, Pressable, RefreshControl } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Activity,
  Heart,
  AlertCircle,
  Shield,
  CheckCircle,
  XCircle,
  Clock,
  DollarSign,
  TrendingUp,
  FileText,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

// 案例分类
type CaseCategory = 'all' | 'medical' | 'critical_illness' | 'accident' | 'life';

interface ClaimCase {
  id: string;
  title: string;
  category: CaseCategory;
  claimAmount: number; // 理赔金额（万元）
  claimDays: number; // 理赔天数
  isSuccessful: boolean;
  summary: string;
  incident: string; // 出险经过
  claimProcess: string; // 理赔过程
  result: string; // 理赔结果
  insight: string; // 理赔启示
  insuranceCompany: string;
  productName: string;
  publishDate: string;
  tags: string[];
}

const ClaimCaseLibraryScreen: React.FC = () => {
  const navigation = useNavigation();
  const [selectedCategory, setSelectedCategory] = useState<CaseCategory>('all');
  const [cases, setCases] = useState<ClaimCase[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // 案例分类配置
  const categories = [
    { id: 'all', label: '全部', icon: FileText, color: COLORS.text },
    { id: 'medical', label: '医疗险', icon: Activity, color: '#3B82F6' },
    { id: 'critical_illness', label: '重疾险', icon: Heart, color: '#EF4444' },
    { id: 'accident', label: '意外险', icon: AlertCircle, color: '#F59E0B' },
    { id: 'life', label: '寿险', icon: Shield, color: '#8B5CF6' },
  ];

  useEffect(() => {
    loadCases();
  }, [selectedCategory]);

  const loadCases = async () => {
    try {
      setLoading(true);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Mock数据
      const mockCases: ClaimCase[] = [
        {
          id: 'case_001',
          title: '50万重疾理赔，从确诊到到账仅用7天',
          category: 'critical_illness',
          claimAmount: 50,
          claimDays: 7,
          isSuccessful: true,
          summary: '张先生确诊甲状腺癌后，保险公司快速审核，7天即完成理赔。',
          incident: '张先生今年45岁，2023年体检发现甲状腺结节，进一步检查确诊为甲状腺癌。张先生2020年投保了重疾险，保额50万元。',
          claimProcess: '确诊当天联系保险顾问，次日提交理赔材料（诊断证明、病理报告、身份证、银行卡），第3天保险公司通知材料齐全，第5天审核通过，第7天理赔款到账。',
          result: '理赔金额50万元，全额到账。无需额外提供材料，理赔过程顺利。',
          insight: '1. 投保时如实告知健康状况是理赔成功的关键\n2. 及时联系保险顾问，获得理赔指导\n3. 材料准备齐全可以大大加快理赔速度\n4. 甲状腺癌属于轻度重疾，部分产品赔付30%保额，购买前需了解清楚',
          insuranceCompany: '平安人寿',
          productName: '平安福2021',
          publishDate: '2024-01-15',
          tags: ['重疾险', '快速理赔', '成功案例'],
        },
        {
          id: 'case_002',
          title: '医疗险理赔被拒，原因竟是"未如实告知"',
          category: 'medical',
          claimAmount: 0,
          claimDays: 15,
          isSuccessful: false,
          summary: '李女士因肺炎住院申请理赔，但因投保时未告知既往病史被拒赔。',
          incident: '李女士因肺炎住院治疗，花费2.3万元。向保险公司申请百万医疗险理赔时，被要求提供既往病历。调查发现李女士2年前曾因慢性支气管炎住院，但投保时未在健康告知中说明。',
          claimProcess: '提交理赔申请后，保险公司调查发现既往病史，要求李女士提供2年前的住院记录。经核实，保险公司认定李女士未如实告知，做出拒赔决定。',
          result: '理赔被拒，保险合同被解除，已交保费退还，但需扣除保险公司管理费用。',
          insight: '1. 健康告知必须如实填写，有病史一定要告知\n2. 即使是"小毛病"也要如实说明，保险公司会根据情况核保\n3. 如果不确定是否需要告知，建议咨询专业顾问\n4. 隐瞒病史不仅会导致拒赔，还会解除合同',
          insuranceCompany: '众安保险',
          productName: '尊享e生2023',
          publishDate: '2024-01-12',
          tags: ['医疗险', '拒赔案例', '健康告知'],
        },
        {
          id: 'case_003',
          title: '意外摔伤骨折，3天获赔1.5万元',
          category: 'accident',
          claimAmount: 1.5,
          claimDays: 3,
          isSuccessful: true,
          summary: '王先生意外摔伤导致右腿骨折，保险公司快速赔付医疗费和误工费。',
          incident: '王先生外出时不慎摔倒，导致右腿骨折，住院治疗10天，花费医疗费1.2万元。王先生投保了综合意外险，保额10万元。',
          claimProcess: '出院当天联系保险公司报案，提交住院病历、医疗发票、诊断证明等材料。保险公司当天受理，第2天审核通过，第3天理赔款到账。',
          result: '医疗费1.2万元全额报销，另外赔付住院津贴300元（30元/天×10天），总计赔付1.53万元。',
          insight: '1. 意外险理赔通常较快，材料齐全一般3-5天到账\n2. 注意保留所有医疗票据原件\n3. 意外险不仅赔付医疗费，还有住院津贴\n4. 社保报销后的剩余部分也可以理赔',
          insuranceCompany: '众安保险',
          productName: '个人综合意外险',
          publishDate: '2024-01-10',
          tags: ['意外险', '快速理赔', '成功案例'],
        },
        {
          id: 'case_004',
          title: '身故理赔100万，家人获得经济保障',
          category: 'life',
          claimAmount: 100,
          claimDays: 20,
          isSuccessful: true,
          summary: '李先生突发疾病身故，寿险理赔100万元为家庭提供了经济支持。',
          incident: '李先生40岁，是家庭主要经济来源。2023年突发心梗不幸身故，留下妻子和两个未成年子女。李先生生前投保了定期寿险，保额100万元。',
          claimProcess: '家属联系保险顾问报案，提供死亡证明、火化证明、受益人身份证明等材料。由于涉及大额理赔，保险公司进行了详细调查，确认为疾病身故，符合理赔条件。',
          result: '理赔金额100万元全额支付给指定受益人（妻子），为家庭提供了重要的经济支持。',
          insight: '1. 寿险是家庭经济支柱的必备保障\n2. 一定要指定受益人，避免理赔纠纷\n3. 保额应覆盖家庭债务和未来开支\n4. 理赔时需要派出所、医院等多个部门的证明材料',
          insuranceCompany: '华贵人寿',
          productName: '大麦定期寿险',
          publishDate: '2024-01-08',
          tags: ['寿险', '身故理赔', '成功案例'],
        },
        {
          id: 'case_005',
          title: '等待期内出险，理赔被拒属正常',
          category: 'medical',
          claimAmount: 0,
          claimDays: 10,
          isSuccessful: false,
          summary: '赵女士刚投保医疗险30天就确诊疾病，因在等待期内被拒赔。',
          incident: '赵女士投保百万医疗险仅30天后，就因急性阑尾炎住院手术。申请理赔时被告知在等待期内，不予理赔。',
          claimProcess: '提交理赔申请后，保险公司核实投保时间和住院时间，确认在等待期内（一般医疗90天，重疾30-180天），根据合同条款做出拒赔决定。',
          result: '理赔被拒，但保险合同继续有效。等待期过后的疾病可以正常理赔。',
          insight: '1. 投保时要了解等待期条款，一般医疗30-90天，重疾90-180天\n2. 意外事故没有等待期，可以立即理赔\n3. 等待期内出险被拒赔不代表保险无效\n4. 建议在健康时尽早投保，避免等待期风险',
          insuranceCompany: '人保健康',
          productName: '好医保长期医疗',
          publishDate: '2024-01-05',
          tags: ['医疗险', '等待期', '拒赔案例'],
        },
      ];

      // 筛选逻辑
      let filtered = mockCases;
      if (selectedCategory !== 'all') {
        filtered = filtered.filter(c => c.category === selectedCategory);
      }

      setCases(filtered);
    } catch (error) {
      console.error('加载案例失败:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = () => {
    setRefreshing(true);
    loadCases();
  };

  const handleCasePress = (caseItem: ClaimCase) => {
    console.log('查看案例:', caseItem.title);
    // navigation.navigate('ClaimCaseDetail' as never, { caseId: caseItem.id } as never);
  };

  const renderCaseCard = (caseItem: ClaimCase) => {
    const categoryConfig = categories.find(c => c.id === caseItem.category);

    return (
      <Pressable key={caseItem.id} onPress={() => handleCasePress(caseItem)}>
        <View
          marginBottom="$3"
          backgroundColor="$surface"
          borderRadius="$4"
          borderWidth={1}
          borderColor="$borderColor"
          overflow="hidden"
        >
          <View padding="$4">
            {/* 顶部标签行 */}
            <XStack alignItems="center" justifyContent="space-between" marginBottom="$3">
              <XStack alignItems="center" gap="$2">
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor={`${categoryConfig?.color}20`}
                  borderRadius="$2"
                >
                  <Text fontSize="$1" fontWeight="600" color={categoryConfig?.color}>
                    {categoryConfig?.label}
                  </Text>
                </View>
                <View
                  paddingHorizontal="$2"
                  paddingVertical="$1"
                  backgroundColor={caseItem.isSuccessful ? '#DCFCE7' : '#FEE2E2'}
                  borderRadius="$2"
                >
                  <XStack alignItems="center" gap="$1">
                    {caseItem.isSuccessful ? (
                      <CheckCircle size={12} color={COLORS.success} />
                    ) : (
                      <XCircle size={12} color={COLORS.error} />
                    )}
                    <Text
                      fontSize="$1"
                      fontWeight="600"
                      color={caseItem.isSuccessful ? COLORS.success : COLORS.error}
                    >
                      {caseItem.isSuccessful ? '成功理赔' : '拒赔案例'}
                    </Text>
                  </XStack>
                </View>
              </XStack>
            </XStack>

            {/* 标题 */}
            <Text fontSize="$5" fontWeight="700" color="$text" marginBottom="$2" lineHeight={24}>
              {caseItem.title}
            </Text>

            {/* 摘要 */}
            <Text fontSize="$3" color="$textSecondary" lineHeight={22} marginBottom="$3">
              {caseItem.summary}
            </Text>

            {/* 关键数据 */}
            <XStack gap="$4" marginBottom="$3">
              <XStack alignItems="center" gap="$1">
                <DollarSign size={16} color={caseItem.isSuccessful ? COLORS.success : COLORS.textSecondary} />
                <Text fontSize="$2" color="$textSecondary">
                  理赔金额
                </Text>
                <Text fontSize="$3" fontWeight="700" color={caseItem.isSuccessful ? COLORS.success : COLORS.error}>
                  {caseItem.isSuccessful ? `${caseItem.claimAmount}万元` : '被拒'}
                </Text>
              </XStack>
              <XStack alignItems="center" gap="$1">
                <Clock size={16} color={COLORS.primary} />
                <Text fontSize="$2" color="$textSecondary">
                  处理时长
                </Text>
                <Text fontSize="$3" fontWeight="700" color={COLORS.primary}>
                  {caseItem.claimDays}天
                </Text>
              </XStack>
            </XStack>

            {/* 保险产品信息 */}
            <View
              padding="$3"
              backgroundColor="$borderColor"
              borderRadius="$3"
              marginBottom="$3"
            >
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  保险公司
                </Text>
                <Text fontSize="$2" fontWeight="600" color="$text">
                  {caseItem.insuranceCompany}
                </Text>
              </XStack>
              <XStack justifyContent="space-between" marginTop="$1">
                <Text fontSize="$2" color="$textSecondary">
                  产品名称
                </Text>
                <Text fontSize="$2" fontWeight="600" color="$text">
                  {caseItem.productName}
                </Text>
              </XStack>
            </View>

            {/* 理赔启示预览 */}
            <View
              padding="$3"
              backgroundColor={caseItem.isSuccessful ? '#DCFCE7' : '#FEF3C7'}
              borderRadius="$3"
              borderLeftWidth={3}
              borderLeftColor={caseItem.isSuccessful ? COLORS.success : COLORS.warning}
            >
              <Text fontSize="$2" fontWeight="600" color="$text" marginBottom="$1">
                理赔启示
              </Text>
              <Text fontSize="$2" color="$text" lineHeight={20} numberOfLines={2}>
                {caseItem.insight}
              </Text>
            </View>

            {/* 底部信息 */}
            <XStack justifyContent="space-between" alignItems="center" marginTop="$3">
              <XStack alignItems="center" gap="$2">
                {caseItem.tags.map(tag => (
                  <View
                    key={tag}
                    paddingHorizontal="$2"
                    paddingVertical="$1"
                    backgroundColor="$surface"
                    borderWidth={1}
                    borderColor="$borderColor"
                    borderRadius="$2"
                  >
                    <Text fontSize="$1" color="$textSecondary">
                      #{tag}
                    </Text>
                  </View>
                ))}
              </XStack>
              <Text fontSize="$2" color="$textSecondary">
                {caseItem.publishDate}
              </Text>
            </XStack>
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* Header */}
      <XStack
        height={56}
        alignItems="center"
        paddingHorizontal="$4"
        backgroundColor="$surface"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <Pressable onPress={() => navigation.goBack()}>
          <ArrowLeft size={24} color={COLORS.text} />
        </Pressable>
        <Text flex={1} textAlign="center" fontSize="$5" fontWeight="600" color="$text">
          理赔案例库
        </Text>
        <View width={24} />
      </XStack>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
      >
        {/* 说明Banner */}
        <View
          marginHorizontal="$4"
          marginTop="$4"
          padding="$3"
          backgroundColor="#E0F2FE"
          borderRadius="$3"
          borderLeftWidth={3}
          borderLeftColor={COLORS.primary}
        >
          <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$1">
            真实案例，值得借鉴
          </Text>
          <Text fontSize="$2" color="$textSecondary" lineHeight={20}>
            以下案例均来自真实理赔记录，帮助您了解理赔流程、注意事项和常见问题。
          </Text>
        </View>

        {/* 分类标签 */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 16 }}>
          <XStack paddingHorizontal="$4" gap="$2">
            {categories.map(category => {
              const Icon = category.icon;
              const isSelected = selectedCategory === category.id;
              return (
                <Pressable key={category.id} onPress={() => setSelectedCategory(category.id as CaseCategory)}>
                  <View
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                    borderRadius="$3"
                    backgroundColor={isSelected ? category.color : '$surface'}
                    borderWidth={1}
                    borderColor={isSelected ? category.color : '$borderColor'}
                  >
                    <XStack alignItems="center" gap="$2">
                      <Icon size={16} color={isSelected ? 'white' : category.color} />
                      <Text
                        fontSize="$3"
                        fontWeight="600"
                        color={isSelected ? 'white' : category.color}
                      >
                        {category.label}
                      </Text>
                    </XStack>
                  </View>
                </Pressable>
              );
            })}
          </XStack>
        </ScrollView>

        {/* 案例列表 */}
        <View paddingHorizontal="$4">
          {loading && cases.length === 0 ? (
            <View padding="$8" alignItems="center">
              <Text fontSize="$3" color="$textSecondary">
                加载中...
              </Text>
            </View>
          ) : cases.length === 0 ? (
            <View padding="$8" alignItems="center">
              <FileText size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$text" marginTop="$4">
                暂无案例
              </Text>
              <Text fontSize="$3" color="$textSecondary" marginTop="$2">
                请选择其他分类
              </Text>
            </View>
          ) : (
            <>{cases.map(c => renderCaseCard(c))}</>
          )}
        </View>

        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default ClaimCaseLibraryScreen;
