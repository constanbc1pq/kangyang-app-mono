import React, { useState } from 'react';
import { ScrollView, Pressable, TextInput } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { useNavigation } from '@react-navigation/native';
import {
  ArrowLeft,
  Calculator,
  DollarSign,
  TrendingUp,
  Shield,
  Heart,
  Briefcase,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

type CalculatorType = 'premium' | 'pension' | 'life_coverage' | 'critical_illness' | 'annuity_return';

const InsuranceCalculatorScreen: React.FC = () => {
  const navigation = useNavigation();
  const [activeCalculator, setActiveCalculator] = useState<CalculatorType>('premium');

  // 保费计算器状态
  const [premiumAge, setPremiumAge] = useState('');
  const [premiumGender, setPremiumGender] = useState<'male' | 'female'>('male');
  const [premiumCoverage, setPremiumCoverage] = useState('');
  const [premiumResult, setPremiumResult] = useState<number | null>(null);

  // 养老金计算器状态
  const [currentAge, setCurrentAge] = useState('');
  const [retireAge, setRetireAge] = useState('');
  const [monthlyExpense, setMonthlyExpense] = useState('');
  const [currentSavings, setCurrentSavings] = useState('');
  const [pensionGap, setPensionGap] = useState<number | null>(null);

  // 寿险保额计算器状态
  const [familyDebt, setFamilyDebt] = useState(''); // 家庭债务
  const [childEducation, setChildEducation] = useState(''); // 子女教育
  const [parentSupport, setParentSupport] = useState(''); // 父母赡养
  const [livingExpense, setLivingExpense] = useState(''); // 生活费
  const [lifeCoverageResult, setLifeCoverageResult] = useState<number | null>(null);

  // 重疾保额计算器状态
  const [annualIncome, setAnnualIncome] = useState('');
  const [recoveryYears, setRecoveryYears] = useState('3'); // 康复年限
  const [medicalCost, setMedicalCost] = useState('50'); // 医疗费用（万）
  const [criticalIllnessResult, setCriticalIllnessResult] = useState<number | null>(null);

  // 年金收益计算器状态
  const [annuityAmount, setAnnuityAmount] = useState(''); // 投入金额
  const [annuityYears, setAnnuityYears] = useState(''); // 缴费年限
  const [annuityRate, setAnnuityRate] = useState('3.0'); // 预定利率
  const [receiveAge, setReceiveAge] = useState('60'); // 领取年龄
  const [annuityReturnResult, setAnnuityReturnResult] = useState<any>(null);

  const calculators = [
    { id: 'premium', label: '保费计算', icon: Calculator, color: '#3B82F6' },
    { id: 'pension', label: '养老金缺口', icon: TrendingUp, color: '#10B981' },
    { id: 'life_coverage', label: '寿险保额', icon: Shield, color: '#8B5CF6' },
    { id: 'critical_illness', label: '重疾保额', icon: Heart, color: '#EF4444' },
    { id: 'annuity_return', label: '年金收益', icon: Briefcase, color: '#F59E0B' },
  ];

  // 保费计算
  const calculatePremium = () => {
    if (!premiumAge || !premiumCoverage) return;
    const age = parseInt(premiumAge);
    const coverage = parseInt(premiumCoverage);
    // 简化计算：基础费率 * 年龄系数 * 性别系数 * 保额
    const baseRate = 0.003;
    const ageMultiplier = 1 + (age - 30) * 0.05;
    const genderMultiplier = premiumGender === 'male' ? 1.2 : 1.0;
    const result = coverage * 10000 * baseRate * ageMultiplier * genderMultiplier;
    setPremiumResult(Math.round(result));
  };

  // 养老金缺口计算
  const calculatePensionGap = () => {
    if (!currentAge || !retireAge || !monthlyExpense || !currentSavings) return;
    const age = parseInt(currentAge);
    const retire = parseInt(retireAge);
    const expense = parseFloat(monthlyExpense);
    const savings = parseFloat(currentSavings);
    // 简化计算：退休后需要的总额 - 现有储蓄
    const yearsToRetire = retire - age;
    const retirementYears = 25; // 假设退休后生活25年
    const totalNeeded = expense * 12 * retirementYears;
    const gap = totalNeeded - savings;
    setPensionGap(Math.round(gap));
  };

  // 寿险保额计算
  const calculateLifeCoverage = () => {
    if (!familyDebt || !childEducation || !parentSupport || !livingExpense) return;
    const total =
      parseFloat(familyDebt) +
      parseFloat(childEducation) +
      parseFloat(parentSupport) +
      parseFloat(livingExpense);
    setLifeCoverageResult(Math.round(total));
  };

  // 重疾保额计算
  const calculateCriticalIllness = () => {
    if (!annualIncome) return;
    const income = parseFloat(annualIncome);
    const years = parseInt(recoveryYears);
    const medical = parseFloat(medicalCost);
    // 计算：年收入 * 康复年限 + 医疗费用
    const result = income * years + medical;
    setCriticalIllnessResult(Math.round(result));
  };

  // 年金收益计算
  const calculateAnnuityReturn = () => {
    if (!annuityAmount || !annuityYears || !annuityRate) return;
    const amount = parseFloat(annuityAmount);
    const years = parseInt(annuityYears);
    const rate = parseFloat(annuityRate) / 100;
    const age = parseInt(receiveAge);

    // 简化计算：总投入 + 累计收益
    const totalInvest = amount * years;
    const futureValue = totalInvest * Math.pow(1 + rate, years);
    const totalReturn = futureValue - totalInvest;
    const irr = (Math.pow(futureValue / totalInvest, 1 / years) - 1) * 100;

    setAnnuityReturnResult({
      totalInvest,
      futureValue: Math.round(futureValue),
      totalReturn: Math.round(totalReturn),
      irr: irr.toFixed(2),
      monthlyReceive: Math.round(futureValue / (25 * 12)), // 假设领取25年
    });
  };

  const renderPremiumCalculator = () => (
    <View>
      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
        保费试算
      </Text>
      <Text fontSize="$2" color="$textSecondary" marginBottom="$4" lineHeight={20}>
        根据年龄、性别和保额，估算年度保费。实际保费以保险公司核保为准。
      </Text>

      <YStack gap="$3">
        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            投保年龄
          </Text>
          <TextInput
            placeholder="请输入年龄（18-65岁）"
            placeholderTextColor={COLORS.textSecondary}
            value={premiumAge}
            onChangeText={setPremiumAge}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            性别
          </Text>
          <XStack gap="$2">
            <Pressable style={{ flex: 1 }} onPress={() => setPremiumGender('male')}>
              <View
                height={44}
                borderRadius="$3"
                borderWidth={1}
                borderColor={premiumGender === 'male' ? COLORS.primary : '$borderColor'}
                backgroundColor={premiumGender === 'male' ? `${COLORS.primary}20` : '$surface'}
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize="$3"
                  fontWeight="600"
                  color={premiumGender === 'male' ? COLORS.primary : '$text'}
                >
                  男
                </Text>
              </View>
            </Pressable>
            <Pressable style={{ flex: 1 }} onPress={() => setPremiumGender('female')}>
              <View
                height={44}
                borderRadius="$3"
                borderWidth={1}
                borderColor={premiumGender === 'female' ? COLORS.primary : '$borderColor'}
                backgroundColor={premiumGender === 'female' ? `${COLORS.primary}20` : '$surface'}
                justifyContent="center"
                alignItems="center"
              >
                <Text
                  fontSize="$3"
                  fontWeight="600"
                  color={premiumGender === 'female' ? COLORS.primary : '$text'}
                >
                  女
                </Text>
              </View>
            </Pressable>
          </XStack>
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            保额（万元）
          </Text>
          <TextInput
            placeholder="请输入保额"
            placeholderTextColor={COLORS.textSecondary}
            value={premiumCoverage}
            onChangeText={setPremiumCoverage}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <Pressable onPress={calculatePremium}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            marginTop="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              开始计算
            </Text>
          </View>
        </Pressable>

        {premiumResult !== null && (
          <View
            padding="$4"
            backgroundColor="#E0F2FE"
            borderRadius="$3"
            borderLeftWidth={3}
            borderLeftColor={COLORS.primary}
            marginTop="$3"
          >
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              计算结果
            </Text>
            <XStack alignItems="baseline" gap="$2">
              <Text fontSize="$2" color="$textSecondary">
                预估年保费：
              </Text>
              <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                {premiumResult.toLocaleString()}
              </Text>
              <Text fontSize="$3" color="$textSecondary">
                元/年
              </Text>
            </XStack>
            <Text fontSize="$2" color="$textSecondary" marginTop="$2" lineHeight={18}>
              *此为估算结果，实际保费需根据健康状况、职业等因素核保确定
            </Text>
          </View>
        )}
      </YStack>
    </View>
  );

  const renderPensionCalculator = () => (
    <View>
      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
        养老金缺口计算
      </Text>
      <Text fontSize="$2" color="$textSecondary" marginBottom="$4" lineHeight={20}>
        计算退休后的养老金缺口，帮助您规划养老储蓄。
      </Text>

      <YStack gap="$3">
        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            当前年龄
          </Text>
          <TextInput
            placeholder="请输入当前年龄"
            placeholderTextColor={COLORS.textSecondary}
            value={currentAge}
            onChangeText={setCurrentAge}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            计划退休年龄
          </Text>
          <TextInput
            placeholder="请输入退休年龄"
            placeholderTextColor={COLORS.textSecondary}
            value={retireAge}
            onChangeText={setRetireAge}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            预期月生活费（元）
          </Text>
          <TextInput
            placeholder="请输入月生活费"
            placeholderTextColor={COLORS.textSecondary}
            value={monthlyExpense}
            onChangeText={setMonthlyExpense}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            现有养老储蓄（万元）
          </Text>
          <TextInput
            placeholder="请输入现有储蓄"
            placeholderTextColor={COLORS.textSecondary}
            value={currentSavings}
            onChangeText={setCurrentSavings}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <Pressable onPress={calculatePensionGap}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            marginTop="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              计算缺口
            </Text>
          </View>
        </Pressable>

        {pensionGap !== null && (
          <View
            padding="$4"
            backgroundColor={pensionGap > 0 ? '#FEF3C7' : '#DCFCE7'}
            borderRadius="$3"
            borderLeftWidth={3}
            borderLeftColor={pensionGap > 0 ? COLORS.warning : COLORS.success}
            marginTop="$3"
          >
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              计算结果
            </Text>
            <XStack alignItems="baseline" gap="$2">
              <Text fontSize="$2" color="$textSecondary">
                养老金缺口：
              </Text>
              <Text
                fontSize="$6"
                fontWeight="700"
                color={pensionGap > 0 ? COLORS.warning : COLORS.success}
              >
                {pensionGap > 0 ? pensionGap.toLocaleString() : '无缺口'}
              </Text>
              {pensionGap > 0 && (
                <Text fontSize="$3" color="$textSecondary">
                  万元
                </Text>
              )}
            </XStack>
            <Text fontSize="$2" color="$textSecondary" marginTop="$2" lineHeight={18}>
              {pensionGap > 0
                ? `建议通过年金险、增额终身寿等方式补充养老储蓄`
                : `您的养老储蓄充足，可以安心退休`}
            </Text>
          </View>
        )}
      </YStack>
    </View>
  );

  const renderLifeCoverageCalculator = () => (
    <View>
      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
        寿险保额计算
      </Text>
      <Text fontSize="$2" color="$textSecondary" marginBottom="$4" lineHeight={20}>
        根据家庭责任计算所需寿险保额，确保家人生活无忧。
      </Text>

      <YStack gap="$3">
        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            家庭债务（万元）
          </Text>
          <TextInput
            placeholder="如房贷、车贷等"
            placeholderTextColor={COLORS.textSecondary}
            value={familyDebt}
            onChangeText={setFamilyDebt}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            子女教育费用（万元）
          </Text>
          <TextInput
            placeholder="至独立为止的教育费用"
            placeholderTextColor={COLORS.textSecondary}
            value={childEducation}
            onChangeText={setChildEducation}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            父母赡养费用（万元）
          </Text>
          <TextInput
            placeholder="预计赡养费用"
            placeholderTextColor={COLORS.textSecondary}
            value={parentSupport}
            onChangeText={setParentSupport}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            家庭生活费（万元）
          </Text>
          <TextInput
            placeholder="5-10年生活费"
            placeholderTextColor={COLORS.textSecondary}
            value={livingExpense}
            onChangeText={setLivingExpense}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <Pressable onPress={calculateLifeCoverage}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            marginTop="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              计算保额
            </Text>
          </View>
        </Pressable>

        {lifeCoverageResult !== null && (
          <View
            padding="$4"
            backgroundColor="#E0F2FE"
            borderRadius="$3"
            borderLeftWidth={3}
            borderLeftColor={COLORS.primary}
            marginTop="$3"
          >
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              计算结果
            </Text>
            <XStack alignItems="baseline" gap="$2">
              <Text fontSize="$2" color="$textSecondary">
                建议寿险保额：
              </Text>
              <Text fontSize="$6" fontWeight="700" color={COLORS.primary}>
                {lifeCoverageResult.toLocaleString()}
              </Text>
              <Text fontSize="$3" color="$textSecondary">
                万元
              </Text>
            </XStack>
            <Text fontSize="$2" color="$textSecondary" marginTop="$2" lineHeight={18}>
              这个保额可以覆盖您的家庭责任，为家人提供充分保障
            </Text>
          </View>
        )}
      </YStack>
    </View>
  );

  const renderCriticalIllnessCalculator = () => (
    <View>
      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
        重疾保额计算
      </Text>
      <Text fontSize="$2" color="$textSecondary" marginBottom="$4" lineHeight={20}>
        根据收入损失和医疗费用，计算合理的重疾险保额。
      </Text>

      <YStack gap="$3">
        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            年收入（万元）
          </Text>
          <TextInput
            placeholder="请输入年收入"
            placeholderTextColor={COLORS.textSecondary}
            value={annualIncome}
            onChangeText={setAnnualIncome}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            预计康复年限
          </Text>
          <XStack gap="$2">
            {['3', '5', '10'].map(year => (
              <Pressable
                key={year}
                style={{ flex: 1 }}
                onPress={() => setRecoveryYears(year)}
              >
                <View
                  height={44}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={recoveryYears === year ? COLORS.primary : '$borderColor'}
                  backgroundColor={recoveryYears === year ? `${COLORS.primary}20` : '$surface'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={recoveryYears === year ? COLORS.primary : '$text'}
                  >
                    {year}年
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            预估医疗费用（万元）
          </Text>
          <XStack gap="$2">
            {['30', '50', '100'].map(cost => (
              <Pressable
                key={cost}
                style={{ flex: 1 }}
                onPress={() => setMedicalCost(cost)}
              >
                <View
                  height={44}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={medicalCost === cost ? COLORS.primary : '$borderColor'}
                  backgroundColor={medicalCost === cost ? `${COLORS.primary}20` : '$surface'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={medicalCost === cost ? COLORS.primary : '$text'}
                  >
                    {cost}万
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </View>

        <Pressable onPress={calculateCriticalIllness}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            marginTop="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              计算保额
            </Text>
          </View>
        </Pressable>

        {criticalIllnessResult !== null && (
          <View
            padding="$4"
            backgroundColor="#FEE2E2"
            borderRadius="$3"
            borderLeftWidth={3}
            borderLeftColor={COLORS.error}
            marginTop="$3"
          >
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$2">
              计算结果
            </Text>
            <XStack alignItems="baseline" gap="$2">
              <Text fontSize="$2" color="$textSecondary">
                建议重疾保额：
              </Text>
              <Text fontSize="$6" fontWeight="700" color={COLORS.error}>
                {criticalIllnessResult.toLocaleString()}
              </Text>
              <Text fontSize="$3" color="$textSecondary">
                万元
              </Text>
            </XStack>
            <Text fontSize="$2" color="$textSecondary" marginTop="$2" lineHeight={18}>
              包含{recoveryYears}年收入损失（{parseFloat(annualIncome) * parseInt(recoveryYears)}
              万）+ 医疗费用（{medicalCost}万）
            </Text>
          </View>
        )}
      </YStack>
    </View>
  );

  const renderAnnuityReturnCalculator = () => (
    <View>
      <Text fontSize="$4" fontWeight="600" color="$text" marginBottom="$3">
        年金收益计算
      </Text>
      <Text fontSize="$2" color="$textSecondary" marginBottom="$4" lineHeight={20}>
        计算年金险或增额终身寿的长期收益情况。
      </Text>

      <YStack gap="$3">
        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            年投入金额（万元）
          </Text>
          <TextInput
            placeholder="每年投入金额"
            placeholderTextColor={COLORS.textSecondary}
            value={annuityAmount}
            onChangeText={setAnnuityAmount}
            keyboardType="numeric"
            style={{
              height: 44,
              borderWidth: 1,
              borderColor: COLORS.borderColor,
              borderRadius: 8,
              paddingHorizontal: 12,
              fontSize: 14,
              color: COLORS.text,
              backgroundColor: COLORS.surface,
            }}
          />
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            缴费年限
          </Text>
          <XStack gap="$2">
            {['5', '10', '20'].map(year => (
              <Pressable
                key={year}
                style={{ flex: 1 }}
                onPress={() => setAnnuityYears(year)}
              >
                <View
                  height={44}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={annuityYears === year ? COLORS.primary : '$borderColor'}
                  backgroundColor={annuityYears === year ? `${COLORS.primary}20` : '$surface'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={annuityYears === year ? COLORS.primary : '$text'}
                  >
                    {year}年
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </View>

        <View>
          <Text fontSize="$3" color="$text" marginBottom="$2">
            预定利率（%）
          </Text>
          <XStack gap="$2">
            {['2.5', '3.0', '3.5'].map(rate => (
              <Pressable
                key={rate}
                style={{ flex: 1 }}
                onPress={() => setAnnuityRate(rate)}
              >
                <View
                  height={44}
                  borderRadius="$3"
                  borderWidth={1}
                  borderColor={annuityRate === rate ? COLORS.primary : '$borderColor'}
                  backgroundColor={annuityRate === rate ? `${COLORS.primary}20` : '$surface'}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Text
                    fontSize="$3"
                    fontWeight="600"
                    color={annuityRate === rate ? COLORS.primary : '$text'}
                  >
                    {rate}%
                  </Text>
                </View>
              </Pressable>
            ))}
          </XStack>
        </View>

        <Pressable onPress={calculateAnnuityReturn}>
          <View
            height={48}
            borderRadius="$3"
            backgroundColor={COLORS.primary}
            justifyContent="center"
            alignItems="center"
            marginTop="$2"
          >
            <Text fontSize="$4" fontWeight="600" color="white">
              计算收益
            </Text>
          </View>
        </Pressable>

        {annuityReturnResult && (
          <View
            padding="$4"
            backgroundColor="#FEF3C7"
            borderRadius="$3"
            borderLeftWidth={3}
            borderLeftColor={COLORS.warning}
            marginTop="$3"
          >
            <Text fontSize="$3" fontWeight="600" color="$text" marginBottom="$3">
              计算结果
            </Text>
            <YStack gap="$2">
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  总投入：
                </Text>
                <Text fontSize="$3" fontWeight="600" color="$text">
                  {annuityReturnResult.totalInvest.toLocaleString()}万元
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  账户价值：
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.warning}>
                  {annuityReturnResult.futureValue.toLocaleString()}万元
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  累计收益：
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.success}>
                  {annuityReturnResult.totalReturn.toLocaleString()}万元
                </Text>
              </XStack>
              <XStack justifyContent="space-between">
                <Text fontSize="$2" color="$textSecondary">
                  内部收益率（IRR）：
                </Text>
                <Text fontSize="$3" fontWeight="600" color={COLORS.primary}>
                  {annuityReturnResult.irr}%
                </Text>
              </XStack>
              <View
                marginTop="$2"
                paddingTop="$2"
                borderTopWidth={1}
                borderTopColor="$borderColor"
              >
                <XStack justifyContent="space-between">
                  <Text fontSize="$2" color="$textSecondary">
                    预计月领取：
                  </Text>
                  <Text fontSize="$4" fontWeight="700" color={COLORS.warning}>
                    {annuityReturnResult.monthlyReceive.toLocaleString()}元
                  </Text>
                </XStack>
                <Text fontSize="$1" color="$textSecondary" marginTop="$1">
                  *假设60岁开始领取，领取25年
                </Text>
              </View>
            </YStack>
          </View>
        )}
      </YStack>
    </View>
  );

  const renderCalculator = () => {
    switch (activeCalculator) {
      case 'premium':
        return renderPremiumCalculator();
      case 'pension':
        return renderPensionCalculator();
      case 'life_coverage':
        return renderLifeCoverageCalculator();
      case 'critical_illness':
        return renderCriticalIllnessCalculator();
      case 'annuity_return':
        return renderAnnuityReturnCalculator();
      default:
        return null;
    }
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
        <Text fontSize="$5" fontWeight="600" color="$text" marginLeft="$3">
          保险计算器
        </Text>
      </XStack>

      {/* 计算器类型标签 */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ maxHeight: 60 }}>
        <XStack paddingHorizontal="$4" paddingVertical="$3" gap="$2">
          {calculators.map(calc => {
            const Icon = calc.icon;
            const isActive = activeCalculator === calc.id;
            return (
              <Pressable key={calc.id} onPress={() => setActiveCalculator(calc.id as CalculatorType)}>
                <View
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$3"
                  backgroundColor={isActive ? calc.color : '$surface'}
                  borderWidth={1}
                  borderColor={isActive ? calc.color : '$borderColor'}
                >
                  <XStack alignItems="center" gap="$2">
                    <Icon size={16} color={isActive ? 'white' : calc.color} />
                    <Text fontSize="$3" fontWeight="600" color={isActive ? 'white' : calc.color}>
                      {calc.label}
                    </Text>
                  </XStack>
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </ScrollView>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View padding="$4">{renderCalculator()}</View>
        <View height={20} />
      </ScrollView>
    </View>
  );
};

export default InsuranceCalculatorScreen;
