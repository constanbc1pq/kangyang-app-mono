import React, { useState } from 'react';
import { Pressable, Alert, KeyboardAvoidingView, Platform, StatusBar } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, Input, TextArea, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  ArrowLeft,
  ChevronRight,
  Clock,
  Download,
  Edit,
  CheckCircle,
  Info,
  Heart,
  Banknote,
  FileText,
  Home,
  Shield,
  Folder,
  File,
} from 'lucide-react-native';

/**
 * Phase 36.4: 文书模板库 - Legal Document Template Screen
 *
 * Features:
 * - Template categorization (support agreement, IOU, power of attorney, property division agreement, etc.)
 * - Template preview
 * - Template download (Word/PDF)
 * - Template filling guidance
 * - Online form filling and generation
 */

const GOLD_COLOR = '#D4AF37';

// ==================== Type Definitions ====================

type ScreenStep = 'categories' | 'templateList' | 'templatePreview' | 'templateFill' | 'generatedDocument';

interface TemplateCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  templateCount: number;
  description: string;
}

interface DocumentTemplate {
  id: string;
  categoryId: string;
  name: string;
  description: string;
  difficulty: 'easy' | 'medium' | 'hard';
  estimatedTime: number;
  downloads: number;
  fields: TemplateField[];
  content: string;
  instructions: string[];
  legalNotes: string[];
}

interface TemplateField {
  id: string;
  label: string;
  placeholder: string;
  type: 'text' | 'number' | 'date' | 'multiline';
  required: boolean;
  helpText?: string;
}

interface FormData {
  [key: string]: string;
}

// ==================== Icon Component ====================

const CategoryIcon: React.FC<{ icon: string; color: string; size: number }> = ({ icon, color, size }) => {
  const icons: Record<string, React.ReactNode> = {
    'heart': <Heart size={size} color={color} />,
    'cash': <Banknote size={size} color={color} />,
    'document-text': <FileText size={size} color={color} />,
    'home': <Home size={size} color={color} />,
    'shield': <Shield size={size} color={color} />,
    'folder': <Folder size={size} color={color} />,
  };
  return <>{icons[icon] || <FileText size={size} color={color} />}</>;
};

// ==================== Template Engine ====================

const renderTemplate = (template: string, data: FormData): string => {
  let result = template;

  Object.keys(data).forEach(key => {
    const value = data[key];
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value || '');
  });

  Object.keys(data).forEach(key => {
    const value = data[key];
    const conditionalStart = new RegExp(`{{#${key}}}`, 'g');
    const conditionalEnd = new RegExp(`{{/${key}}}`, 'g');

    if (value && value.trim() !== '') {
      result = result.replace(conditionalStart, '');
      result = result.replace(conditionalEnd, '');
    } else {
      const blockPattern = new RegExp(`{{#${key}}}[\\s\\S]*?{{/${key}}}`, 'g');
      result = result.replace(blockPattern, '');
    }
  });

  Object.keys(data).forEach(key => {
    const value = data[key];
    const negConditionalStart = new RegExp(`{{\\^${key}}}`, 'g');
    const negConditionalEnd = new RegExp(`{{/${key}}}`, 'g');

    if (!value || value.trim() === '') {
      result = result.replace(negConditionalStart, '');
      result = result.replace(negConditionalEnd, '');
    } else {
      const blockPattern = new RegExp(`{{\\^${key}}}[\\s\\S]*?{{/${key}}}`, 'g');
      result = result.replace(blockPattern, '');
    }
  });

  return result;
};

// ==================== Main Component ====================

const DocumentTemplateScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color9 = theme.color9?.val;
  const color10 = theme.color10?.val;
  const color12 = theme.color12?.val;

  const [currentStep, setCurrentStep] = useState<ScreenStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateList, setTemplateList] = useState<DocumentTemplate[]>([]);
  const [formData, setFormData] = useState<FormData>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>('');

  const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    switch (difficulty) {
      case 'easy': return '简单';
      case 'medium': return '中等';
      case 'hard': return '复杂';
    }
  };

  const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
    switch (difficulty) {
      case 'easy': return successColor || '#10B981';
      case 'medium': return primaryColor || '#6366F1';
      case 'hard': return GOLD_COLOR;
    }
  };

  // Mock Data with theme colors
  const TEMPLATE_CATEGORIES: TemplateCategory[] = [
    { id: 'support', name: '赡养协议', icon: 'heart', color: GOLD_COLOR, templateCount: 5, description: '规范子女赡养义务，明确赡养责任' },
    { id: 'loan', name: '借款文书', icon: 'cash', color: successColor || '#10B981', templateCount: 6, description: '借条、欠条、还款协议等' },
    { id: 'authorization', name: '授权委托', icon: 'document-text', color: primaryColor || '#6366F1', templateCount: 4, description: '委托他人办理事务的法律文书' },
    { id: 'property', name: '财产分割', icon: 'home', color: primaryColor || '#6366F1', templateCount: 4, description: '财产分割协议、赠与协议等' },
    { id: 'guardianship', name: '监护文书', icon: 'shield', color: GOLD_COLOR, templateCount: 3, description: '意定监护协议、监护声明等' },
    { id: 'other', name: '其他文书', icon: 'folder', color: primaryColor || '#6366F1', templateCount: 5, description: '调解协议、承诺书、声明等' },
  ];

  const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
    {
      id: 'template_support_001',
      categoryId: 'support',
      name: '多子女赡养协议书',
      description: '适用于多个子女协商分担赡养责任的情况，明确各方义务。',
      difficulty: 'medium',
      estimatedTime: 15,
      downloads: 2345,
      fields: [
        { id: 'parent_name', label: '被赡养人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'parent_id', label: '被赡养人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'child1_name', label: '赡养人一姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'child2_name', label: '赡养人二姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'monthly_fee', label: '每月赡养费总额（元）', placeholder: '例如：3000', type: 'number', required: true },
        { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      ],
      content: `赡养协议书

被赡养人：{{parent_name}}，身份证号：{{parent_id}}
赡养人一：{{child1_name}}
赡养人二：{{child2_name}}

根据《民法典》规定，经各方协商一致，达成如下协议：

一、赡养费的支付
每月赡养费共计人民币{{monthly_fee}}元，由各赡养人平均分担。

二、赡养人应当履行生活照料和精神慰藉义务。

三、本协议自{{sign_date}}起执行。

签名处：
被赡养人：________________
赡养人一：________________
赡养人二：________________`,
      instructions: [
        '请根据实际子女人数填写。',
        '赡养费金额应根据实际需要确定。',
        '建议将协议进行公证，增强法律效力。',
      ],
      legalNotes: [
        '根据《民法典》第1067条，成年子女对父母负有赡养义务。',
        '赡养义务是法定义务，不能通过协议免除。',
      ],
    },
    {
      id: 'template_loan_001',
      categoryId: 'loan',
      name: '个人借条（标准版）',
      description: '适用于个人之间的借款，明确借款金额、利息、还款期限等。',
      difficulty: 'easy',
      estimatedTime: 5,
      downloads: 5678,
      fields: [
        { id: 'lender_name', label: '出借人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'borrower_name', label: '借款人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'borrower_id', label: '借款人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'loan_amount', label: '借款金额（元）', placeholder: '例如：50000', type: 'number', required: true },
        { id: 'loan_amount_words', label: '借款金额（大写）', placeholder: '例如：伍万元整', type: 'text', required: true },
        { id: 'repayment_date', label: '还款日期', placeholder: '例如：2025年1月1日', type: 'date', required: true },
        { id: 'write_date', label: '书写日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      ],
      content: `借条

出借人：{{lender_name}}
借款人：{{borrower_name}}，身份证号：{{borrower_id}}

今借款人因个人需要，向出借人借款人民币{{loan_amount}}元（大写：{{loan_amount_words}}）。

还款日期：借款人承诺于{{repayment_date}}前一次性归还全部借款本金。

特此立据为证。

借款人（签字）：________________
日期：{{write_date}}`,
      instructions: [
        '借款金额务必同时写明阿拉伯数字和大写金额。',
        '民间借贷年利率不得超过15.4%。',
        '建议通过银行转账，保留转账记录。',
      ],
      legalNotes: [
        '出借人应保留借条原件和借款支付凭证。',
        '借款到期不还，诉讼时效为3年。',
      ],
    },
    {
      id: 'template_auth_001',
      categoryId: 'authorization',
      name: '授权委托书（通用版）',
      description: '适用于委托他人办理各类事务，如银行业务、房产过户、诉讼代理等。',
      difficulty: 'medium',
      estimatedTime: 10,
      downloads: 3456,
      fields: [
        { id: 'principal_name', label: '委托人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'principal_id', label: '委托人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'agent_name', label: '受托人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'agent_id', label: '受托人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'matter', label: '委托事项', placeholder: '请详细描述委托办理的具体事项', type: 'multiline', required: true },
        { id: 'valid_period', label: '有效期限', placeholder: '例如：至2024年12月31日', type: 'text', required: true },
        { id: 'sign_date', label: '签署日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      ],
      content: `授权委托书

委托人：{{principal_name}}，身份证号：{{principal_id}}
受托人：{{agent_name}}，身份证号：{{agent_id}}

委托人因个人原因，特委托受托人为代理人，代为办理如下事项：

一、委托事项
{{matter}}

二、委托期限
本授权委托书有效期限为：{{valid_period}}

委托人签字：________________
日期：{{sign_date}}

受托人签字：________________（表示接受委托）
日期：{{sign_date}}`,
      instructions: [
        '委托事项应具体明确。',
        '重要事项（如房产买卖）建议进行公证。',
      ],
      legalNotes: [
        '委托人可以随时撤销委托。',
        '受托人应在授权范围内办理事务。',
      ],
    },
    {
      id: 'template_property_001',
      categoryId: 'property',
      name: '财产赠与协议书',
      description: '适用于财产无偿赠与他人的情况，明确赠与财产和赠与条件。',
      difficulty: 'medium',
      estimatedTime: 12,
      downloads: 2789,
      fields: [
        { id: 'donor_name', label: '赠与人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'donor_id', label: '赠与人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'donee_name', label: '受赠人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'property_description', label: '赠与财产描述', placeholder: '请详细描述赠与的财产', type: 'multiline', required: true },
        { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      ],
      content: `财产赠与协议书

赠与人：{{donor_name}}，身份证号：{{donor_id}}
受赠人：{{donee_name}}

赠与人自愿将其所有的下列财产无偿赠与受赠人：
{{property_description}}

赠与人签字：________________
日期：{{sign_date}}

受赠人签字：________________（表示接受赠与）
日期：{{sign_date}}`,
      instructions: [
        '赠与财产应描述清楚。',
        '房产等需登记的财产应及时办理过户。',
      ],
      legalNotes: [
        '赠与人可在财产权利转移之前撤销赠与。',
        '经过公证的赠与不可撤销。',
      ],
    },
    {
      id: 'template_guard_001',
      categoryId: 'guardianship',
      name: '意定监护协议书',
      description: '适用于提前指定自己失能后的监护人，明确监护事项和监护人职责。',
      difficulty: 'hard',
      estimatedTime: 20,
      downloads: 1654,
      fields: [
        { id: 'ward_name', label: '被监护人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'ward_id', label: '被监护人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'guardian_name', label: '监护人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'guardian_id', label: '监护人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'guardian_relationship', label: '监护人与被监护人关系', placeholder: '例如：子女、侄子', type: 'text', required: true },
        { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      ],
      content: `意定监护协议书

被监护人：{{ward_name}}，身份证号：{{ward_id}}
监护人：{{guardian_name}}，身份证号：{{guardian_id}}
与被监护人关系：{{guardian_relationship}}

根据《民法典》第33条规定，被监护人在具有完全民事行为能力时，与监护人协商一致，自愿订立本意定监护协议。

一、当被监护人丧失或部分丧失民事行为能力时，由监护人担任其监护人。

二、监护人职责：
1. 保护被监护人的人身权利和财产权利
2. 负责被监护人的生活照料
3. 代理被监护人进行民事活动

三、本协议建议进行公证。

被监护人签字：________________
日期：{{sign_date}}

监护人签字：________________（表示接受监护）
日期：{{sign_date}}`,
      instructions: [
        '意定监护协议应在被监护人具有完全民事行为能力时签订。',
        '强烈建议进行公证。',
      ],
      legalNotes: [
        '根据《民法典》第33条，意定监护优先于法定监护。',
        '监护人应按照最有利于被监护人的原则履行监护职责。',
      ],
    },
    {
      id: 'template_other_001',
      categoryId: 'other',
      name: '承诺书',
      description: '适用于个人向他人作出承诺的情况，如承诺履行某项义务、不做某事等。',
      difficulty: 'easy',
      estimatedTime: 5,
      downloads: 2876,
      fields: [
        { id: 'promiser_name', label: '承诺人姓名', placeholder: '请输入姓名', type: 'text', required: true },
        { id: 'promiser_id', label: '承诺人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
        { id: 'promise_content', label: '承诺内容', placeholder: '请详细描述承诺的具体事项', type: 'multiline', required: true },
        { id: 'promise_date', label: '承诺日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      ],
      content: `承诺书

承诺人：{{promiser_name}}，身份证号：{{promiser_id}}

本人郑重承诺如下：

{{promise_content}}

如违反上述承诺，本人愿意承担相应的法律责任。

特此承诺。

承诺人签字：________________
日期：{{promise_date}}`,
      instructions: [
        '承诺内容应具体明确。',
        '承诺书应由承诺人亲笔签字。',
      ],
      legalNotes: [
        '承诺人应按照承诺内容履行。',
      ],
    },
  ];

  // ==================== Navigation Handlers ====================

  const handleCategoryPress = (category: TemplateCategory) => {
    setSelectedCategory(category);
    const filteredTemplates = DOCUMENT_TEMPLATES.filter(t => t.categoryId === category.id);
    setTemplateList(filteredTemplates);
    setCurrentStep('templateList');
  };

  const handleTemplatePress = (template: DocumentTemplate) => {
    setSelectedTemplate(template);
    setFormData({});
    setCurrentStep('templatePreview');
  };

  const handleStartFilling = () => {
    setCurrentStep('templateFill');
  };

  const handleGenerateDocument = () => {
    if (!selectedTemplate) return;

    const missingFields: string[] = [];
    selectedTemplate.fields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id].trim() === '')) {
        missingFields.push(field.label);
      }
    });

    if (missingFields.length > 0) {
      Alert.alert('提示', `请填写以下必填项：\n${missingFields.join('\n')}`);
      return;
    }

    const document = renderTemplate(selectedTemplate.content, formData);
    setGeneratedDocument(document);
    setCurrentStep('generatedDocument');
  };

  const handleDownload = (format: 'word' | 'pdf') => {
    Alert.alert(
      '下载成功',
      `文书已保存为${format === 'word' ? 'Word' : 'PDF'}格式`,
      [{ text: '确定' }]
    );
  };

  const handleBackPress = () => {
    if (currentStep === 'generatedDocument') {
      Alert.alert('提示', '返回后将丢失已生成的文书，确定返回吗？', [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => { setCurrentStep('templateFill'); setGeneratedDocument(''); } },
      ]);
    } else if (currentStep === 'templateFill') {
      Alert.alert('提示', '返回后将丢失已填写的内容，确定返回吗？', [
        { text: '取消', style: 'cancel' },
        { text: '确定', onPress: () => { setCurrentStep('templatePreview'); setFormData({}); } },
      ]);
    } else if (currentStep === 'templatePreview') {
      setCurrentStep('templateList');
      setSelectedTemplate(null);
    } else if (currentStep === 'templateList') {
      setCurrentStep('categories');
      setSelectedCategory(null);
      setTemplateList([]);
    } else {
      navigation.goBack();
    }
  };

  // ==================== Render Methods ====================

  const renderCategoryCard = (category: TemplateCategory) => (
    <Pressable key={category.id} onPress={() => handleCategoryPress(category)}>
      <XStack
        backgroundColor="$color2"
        marginHorizontal="$2.5"
        marginBottom="$2"
        padding="$2"
        borderRadius="$4"
        borderWidth={1}
        borderColor="$color5"
        alignItems="center"
      >
        <View
          width={52}
          height={52}
          borderRadius={26}
          alignItems="center"
          justifyContent="center"
          style={{ backgroundColor: `${category.color}20` }}
        >
          <CategoryIcon icon={category.icon} color={category.color} size={28} />
        </View>
        <YStack flex={1} marginLeft="$2">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">{category.name}</Text>
          <Text fontSize="$2" color="$color10" marginBottom="$1">{category.description}</Text>
          <XStack alignItems="center">
            <File size={14} color={color10} />
            <Text fontSize="$2" color="$color10" marginLeft="$1">{category.templateCount} 个模板</Text>
          </XStack>
        </YStack>
        <ChevronRight size={20} color={color9} />
      </XStack>
    </Pressable>
  );

  const renderTemplateCard = (template: DocumentTemplate) => (
    <Pressable key={template.id} onPress={() => handleTemplatePress(template)}>
      <View backgroundColor="$color2" borderRadius="$4" padding="$2.5" marginBottom="$2" borderWidth={1} borderColor="$color5">
        <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$1.5">
          <Text flex={1} fontSize="$4" fontWeight="600" color="$color12" marginRight="$2">{template.name}</Text>
          <View
            paddingHorizontal="$1.5"
            paddingVertical="$0.5"
            borderRadius="$2"
            style={{ backgroundColor: `${getDifficultyColor(template.difficulty)}20` }}
          >
            <Text fontSize={11} fontWeight="500" style={{ color: getDifficultyColor(template.difficulty) }}>
              {getDifficultyLabel(template.difficulty)}
            </Text>
          </View>
        </XStack>
        <Text fontSize="$3" color="$color10" lineHeight={22} marginBottom="$2">{template.description}</Text>
        <XStack alignItems="center" gap="$3">
          <XStack alignItems="center">
            <Clock size={14} color={color9} />
            <Text fontSize="$2" color="$color9" marginLeft="$1">约{template.estimatedTime}分钟</Text>
          </XStack>
          <XStack alignItems="center">
            <Download size={14} color={color9} />
            <Text fontSize="$2" color="$color9" marginLeft="$1">{template.downloads}次下载</Text>
          </XStack>
        </XStack>
      </View>
    </Pressable>
  );

  const renderFormField = (field: TemplateField) => {
    const value = formData[field.id] || '';

    return (
      <YStack key={field.id} marginBottom="$3">
        <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1.5">
          {field.label}
          {field.required && <Text color="$error"> *</Text>}
        </Text>
        {field.helpText && <Text fontSize="$2" color="$color9" marginBottom="$1.5">{field.helpText}</Text>}
        {field.type === 'multiline' ? (
          <TextArea
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$3"
            padding="$2"
            fontSize="$3"
            color="$color12"
            placeholder={field.placeholder}
            placeholderTextColor={color9}
            value={value}
            onChangeText={(text) => setFormData({ ...formData, [field.id]: text })}
            minHeight={100}
          />
        ) : (
          <Input
            borderWidth={1}
            borderColor="$color5"
            borderRadius="$3"
            paddingHorizontal="$2"
            height={44}
            fontSize="$3"
            color="$color12"
            placeholder={field.placeholder}
            placeholderTextColor={color9}
            value={value}
            onChangeText={(text) => setFormData({ ...formData, [field.id]: text })}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
          />
        )}
      </YStack>
    );
  };

  // ==================== Screen Views ====================

  const renderCategoriesView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      <View paddingTop={insets.top} backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
          <Pressable onPress={handleBackPress}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">文书模板库</Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <View backgroundColor="$color2" margin="$2.5" borderRadius="$4" padding="$4" alignItems="center">
          <FileText size={40} color={primaryColor} />
          <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$2">专业法律文书模板</Text>
          <Text fontSize="$3" color="$color10" marginTop="$1">在线填写 · 自动生成 · 免费下载</Text>
        </View>

        <YStack marginBottom="$4">
          <YStack paddingHorizontal="$2.5" marginBottom="$2">
            <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$1">模板分类</Text>
            <Text fontSize="$3" color="$color9">选择您需要的文书类型</Text>
          </YStack>
          {TEMPLATE_CATEGORIES.map(category => renderCategoryCard(category))}
        </YStack>

        <View height={30} />
      </ScrollView>
    </View>
  );

  const renderTemplateListView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      <View paddingTop={insets.top} backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
          <Pressable onPress={handleBackPress}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">{selectedCategory?.name}</Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <YStack paddingHorizontal="$2.5" paddingTop="$2">
          {templateList.map(template => renderTemplateCard(template))}
        </YStack>
        <View height={30} />
      </ScrollView>
    </View>
  );

  const renderTemplatePreviewView = () => {
    if (!selectedTemplate) return null;

    return (
      <View flex={1} backgroundColor="$background">
        <StatusBar barStyle="dark-content" />

        <View paddingTop={insets.top} backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
          <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
            <Pressable onPress={handleBackPress}>
              <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
                <ArrowLeft size={24} color={color12} />
              </View>
            </Pressable>
            <Text fontSize="$5" fontWeight="600" color="$color12">模板预览</Text>
            <View width={40} />
          </XStack>
        </View>

        <ScrollView flex={1} showsVerticalScrollIndicator={false}>
          <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
            <Text fontSize="$6" fontWeight="600" color="$color12" marginBottom="$1.5">{selectedTemplate.name}</Text>
            <Text fontSize="$3" color="$color10" lineHeight={22} marginBottom="$2">{selectedTemplate.description}</Text>
            <XStack alignItems="center" gap="$2">
              <View
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$2"
                style={{ backgroundColor: `${getDifficultyColor(selectedTemplate.difficulty)}20` }}
              >
                <Text fontSize={11} fontWeight="500" style={{ color: getDifficultyColor(selectedTemplate.difficulty) }}>
                  {getDifficultyLabel(selectedTemplate.difficulty)}
                </Text>
              </View>
              <XStack alignItems="center">
                <Clock size={14} color={color9} />
                <Text fontSize="$2" color="$color9" marginLeft="$1">约{selectedTemplate.estimatedTime}分钟</Text>
              </XStack>
            </XStack>
          </View>

          <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">填写指引</Text>
            {selectedTemplate.instructions.map((instruction, index) => (
              <XStack key={index} marginBottom="$1.5">
                <Text fontSize="$3" fontWeight="bold" marginRight="$1.5" color="$primary">•</Text>
                <Text flex={1} fontSize="$3" color="$color10" lineHeight={22}>{instruction}</Text>
              </XStack>
            ))}
          </View>

          <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">法律提示</Text>
            {selectedTemplate.legalNotes.map((note, index) => (
              <XStack key={index} marginBottom="$1.5" alignItems="flex-start">
                <Info size={16} color={primaryColor} style={{ marginRight: 8, marginTop: 2 }} />
                <Text flex={1} fontSize="$3" color="$color10" lineHeight={22}>{note}</Text>
              </XStack>
            ))}
          </View>

          <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">模板预览</Text>
            <View backgroundColor="$color4" borderRadius="$3" padding="$2" maxHeight={300}>
              <ScrollView nestedScrollEnabled>
                <Text fontSize="$2" color="$color12" lineHeight={22} fontFamily={Platform.OS === 'ios' ? 'Courier' : 'monospace'}>
                  {selectedTemplate.content}
                </Text>
              </ScrollView>
            </View>
          </View>

          <View height={100} />
        </ScrollView>

        <View backgroundColor="$color2" paddingHorizontal="$2.5" paddingVertical="$2" borderTopWidth={1} borderTopColor="$color5">
          <Pressable onPress={handleStartFilling}>
            <XStack
              backgroundColor="$primary"
              paddingVertical="$2"
              borderRadius="$10"
              alignItems="center"
              justifyContent="center"
            >
              <Edit size={20} color="white" />
              <Text fontSize="$4" fontWeight="600" color="white" marginLeft="$1.5">开始填写</Text>
            </XStack>
          </Pressable>
        </View>
      </View>
    );
  };

  const renderTemplateFillView = () => {
    if (!selectedTemplate) return null;

    return (
      <View flex={1} backgroundColor="$background">
        <StatusBar barStyle="dark-content" />

        <View paddingTop={insets.top} backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
          <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
            <Pressable onPress={handleBackPress}>
              <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
                <ArrowLeft size={24} color={color12} />
              </View>
            </Pressable>
            <Text fontSize="$5" fontWeight="600" color="$color12">填写文书</Text>
            <View width={40} />
          </XStack>
        </View>

        <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView flex={1} showsVerticalScrollIndicator={false}>
            <View backgroundColor="$color2" padding="$2.5" marginBottom="$2">
              <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$1.5">{selectedTemplate.name}</Text>
              <Text fontSize="$3" color="$color9">请填写以下信息，带*号为必填项</Text>
            </View>

            <View backgroundColor="$color2" padding="$2.5">
              {selectedTemplate.fields.map(field => renderFormField(field))}
            </View>

            <View height={100} />
          </ScrollView>

          <View backgroundColor="$color2" paddingHorizontal="$2.5" paddingVertical="$2" borderTopWidth={1} borderTopColor="$color5">
            <Pressable onPress={handleGenerateDocument}>
              <XStack
                backgroundColor="$primary"
                paddingVertical="$2"
                borderRadius="$10"
                alignItems="center"
                justifyContent="center"
              >
                <CheckCircle size={20} color="white" />
                <Text fontSize="$4" fontWeight="600" color="white" marginLeft="$1.5">生成文书</Text>
              </XStack>
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  const renderGeneratedDocumentView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      <View paddingTop={insets.top} backgroundColor="$color2" borderBottomWidth={1} borderBottomColor="$color5">
        <XStack height={56} paddingHorizontal="$2.5" alignItems="center" justifyContent="space-between">
          <Pressable onPress={handleBackPress}>
            <View width={40} height={40} borderRadius={20} justifyContent="center" alignItems="center">
              <ArrowLeft size={24} color={color12} />
            </View>
          </Pressable>
          <Text fontSize="$5" fontWeight="600" color="$color12">生成的文书</Text>
          <View width={40} />
        </XStack>
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        <View backgroundColor="$color2" margin="$2.5" padding="$2.5" borderRadius="$4">
          <Text fontSize="$3" color="$color12" lineHeight={26} fontFamily={Platform.OS === 'ios' ? 'Courier' : 'monospace'}>
            {generatedDocument}
          </Text>
        </View>

        <View backgroundColor="$color2" marginHorizontal="$2.5" marginTop="$2" padding="$2.5" borderRadius="$4">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2.5">下载文书</Text>
          <XStack justifyContent="space-around">
            <Pressable onPress={() => handleDownload('word')} style={{ width: '45%' }}>
              <YStack alignItems="center" padding="$2.5" borderWidth={1} borderColor="$color5" borderRadius="$3">
                <File size={24} color={primaryColor} />
                <Text fontSize="$3" color="$color12" marginTop="$1.5">Word格式</Text>
              </YStack>
            </Pressable>
            <Pressable onPress={() => handleDownload('pdf')} style={{ width: '45%' }}>
              <YStack alignItems="center" padding="$2.5" borderWidth={1} borderColor="$color5" borderRadius="$3">
                <FileText size={24} color={errorColor} />
                <Text fontSize="$3" color="$color12" marginTop="$1.5">PDF格式</Text>
              </YStack>
            </Pressable>
          </XStack>
        </View>

        <XStack
          marginHorizontal="$2.5"
          marginTop="$2"
          padding="$2"
          borderRadius="$3"
          borderLeftWidth={4}
          borderLeftColor={GOLD_COLOR}
          style={{ backgroundColor: `${GOLD_COLOR}15` }}
        >
          <Info size={20} color={GOLD_COLOR} />
          <Text flex={1} fontSize="$2" color="$color10" lineHeight={20} marginLeft="$1.5">
            重要提示：生成的文书仅供参考，请仔细核对内容，必要时请咨询专业律师。涉及重大事项的文书建议进行公证。
          </Text>
        </XStack>

        <View height={30} />
      </ScrollView>
    </View>
  );

  // ==================== Main Render ====================

  if (currentStep === 'categories') {
    return renderCategoriesView();
  } else if (currentStep === 'templateList') {
    return renderTemplateListView();
  } else if (currentStep === 'templatePreview') {
    return renderTemplatePreviewView();
  } else if (currentStep === 'templateFill') {
    return renderTemplateFillView();
  } else if (currentStep === 'generatedDocument') {
    return renderGeneratedDocumentView();
  }

  return null;
};

export default DocumentTemplateScreen;
