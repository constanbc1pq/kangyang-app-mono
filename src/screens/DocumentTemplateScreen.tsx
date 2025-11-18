import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
  Dimensions,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

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

// ==================== Type Definitions ====================

type ScreenStep = 'categories' | 'templateList' | 'templatePreview' | 'templateFill' | 'generatedDocument';

interface TemplateCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
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
  estimatedTime: number; // in minutes
  downloads: number;
  fields: TemplateField[];
  content: string; // Template content with placeholders
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

// ==================== Mock Data ====================

const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  {
    id: 'support',
    name: '赡养协议',
    icon: 'heart',
    color: '#eb2f96',
    templateCount: 5,
    description: '规范子女赡养义务，明确赡养责任',
  },
  {
    id: 'loan',
    name: '借款文书',
    icon: 'cash',
    color: '#52c41a',
    templateCount: 6,
    description: '借条、欠条、还款协议等',
  },
  {
    id: 'authorization',
    name: '授权委托',
    icon: 'document-text',
    color: '#1890ff',
    templateCount: 4,
    description: '委托他人办理事务的法律文书',
  },
  {
    id: 'property',
    name: '财产分割',
    icon: 'home',
    color: '#722ed1',
    templateCount: 4,
    description: '财产分割协议、赠与协议等',
  },
  {
    id: 'guardianship',
    name: '监护文书',
    icon: 'shield',
    color: '#faad14',
    templateCount: 3,
    description: '意定监护协议、监护声明等',
  },
  {
    id: 'other',
    name: '其他文书',
    icon: 'folder',
    color: '#13c2c2',
    templateCount: 5,
    description: '调解协议、承诺书、声明等',
  },
];

const DOCUMENT_TEMPLATES: DocumentTemplate[] = [
  // Support Agreement Templates
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
      { id: 'child1_id', label: '赡养人一身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
      { id: 'child2_name', label: '赡养人二姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'child2_id', label: '赡养人二身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
      { id: 'child3_name', label: '赡养人三姓名', placeholder: '请输入姓名（选填）', type: 'text', required: false },
      { id: 'child3_id', label: '赡养人三身份证号', placeholder: '请输入身份证号（选填）', type: 'text', required: false },
      { id: 'monthly_fee', label: '每月赡养费总额（元）', placeholder: '例如：3000', type: 'number', required: true },
      { id: 'start_date', label: '协议开始日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
      { id: 'sign_location', label: '签订地点', placeholder: '例如：北京市朝阳区', type: 'text', required: true },
      { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `赡养协议书

被赡养人：{{parent_name}}，身份证号：{{parent_id}}

赡养人一：{{child1_name}}，身份证号：{{child1_id}}
赡养人二：{{child2_name}}，身份证号：{{child2_id}}
{{#child3_name}}赡养人三：{{child3_name}}，身份证号：{{child3_id}}{{/child3_name}}

鉴于被赡养人年事已高，需要赡养人履行赡养义务，根据《中华人民共和国民法典》《中华人民共和国老年人权益保障法》等法律规定，经各方协商一致，达成如下协议：

一、赡养义务的内容

1. 赡养人应当履行对被赡养人经济供养、生活照料和精神慰藉的义务，照顾被赡养人的特殊需要。

2. 赡养人应当使被赡养人保持基本的生活水平，保证被赡养人生活不低于当地一般居民的生活水平。

3. 赡养人不得以放弃继承权或者其他理由，拒绝履行赡养义务。

二、赡养费的支付

1. 经协商，被赡养人每月所需赡养费共计人民币{{monthly_fee}}元。

2. 上述赡养费由各赡养人平均分担，每人每月支付人民币{{monthly_fee_per_person}}元。

3. 赡养费应当在每月5日前支付到被赡养人指定的银行账户。

4. 赡养费标准可根据被赡养人实际需要和赡养人经济状况，经协商后适当调整。

三、医疗费用的承担

1. 被赡养人的医疗费用，在医保报销后的自费部分，由各赡养人平均分担。

2. 如遇重大疾病需住院治疗，赡养人应当及时筹措医疗费用，不得拖延。

3. 被赡养人日常购买药品的费用，由各赡养人轮流承担或平均分摊。

四、生活照料的安排

1. 被赡养人目前自行居住，各赡养人应当定期探望，每周不少于一次。

2. 如被赡养人生活不能自理或需要护理，由赡养人轮流照料，或协商雇请护工，费用由各赡养人平均分担。

3. 被赡养人的日常生活用品采购、家务整理等，由各赡养人协商安排。

五、精神慰藉

1. 赡养人应当关心被赡养人的精神需求，不得忽视、冷落被赡养人。

2. 赡养人应当经常看望或者问候被赡养人，让被赡养人享受亲情关爱。

3. 赡养人在重大节假日应当陪伴被赡养人。

六、居住安排

1. 被赡养人有权选择自己的居住方式和居住地点。

2. 被赡养人目前居住在其自有房屋，赡养人不得强迫被赡养人迁居条件低劣的房屋。

3. 如被赡养人选择与某赡养人共同居住，其他赡养人应当给予经济补偿。

七、协议的履行和监督

1. 各赡养人应当自觉履行本协议约定的义务。

2. 如有赡养人不履行协议，其他赡养人有权监督，并可向居委会、村委会或人民调解委员会申请调解。

3. 协议履行过程中如有争议，应协商解决；协商不成的，可向人民法院起诉。

八、其他约定

1. 本协议自各方签字之日起生效，自{{start_date}}开始执行。

2. 本协议一式{{num_copies}}份，被赡养人及各赡养人各执一份，具有同等法律效力。

被赡养人：________________（签字）
日期：____年____月____日

赡养人一：________________（签字）
日期：____年____月____日

赡养人二：________________（签字）
日期：____年____月____日

{{#child3_name}}
赡养人三：________________（签字）
日期：____年____月____日
{{/child3_name}}

签订地点：{{sign_location}}
签订日期：{{sign_date}}`,
    instructions: [
      '本协议适用于多个子女协商赡养父母的情况，请根据实际子女人数填写。',
      '赡养费金额应根据被赡养人实际需要、当地生活水平和赡养人经济能力综合确定。',
      '建议将协议进行公证，增强法律效力。',
      '协议签订后，各方应严格履行，如需变更，应重新协商并签订补充协议。',
      '被赡养人和所有赡养人必须在协议上亲笔签名，不得代签。',
    ],
    legalNotes: [
      '根据《民法典》第1067条，成年子女对父母负有赡养、扶助和保护的义务。',
      '赡养义务是法定义务，不能通过协议免除，本协议仅对履行方式进行约定。',
      '如赡养人不履行协议，被赡养人有权向法院起诉，要求履行赡养义务。',
      '本协议可作为法院判决的重要参考依据。',
    ],
  },
  {
    id: 'template_support_002',
    categoryId: 'support',
    name: '轮流赡养协议书',
    description: '适用于子女轮流照顾父母的情况，明确轮流周期和责任。',
    difficulty: 'easy',
    estimatedTime: 10,
    downloads: 1876,
    fields: [
      { id: 'parent_name', label: '被赡养人姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'child_count', label: '子女人数', placeholder: '例如：3', type: 'number', required: true },
      { id: 'rotation_period', label: '轮流周期', placeholder: '例如：每人3个月', type: 'text', required: true },
      { id: 'start_person', label: '首轮赡养人', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `轮流赡养协议书

（简化版，完整内容包含轮流安排细节）

被赡养人：{{parent_name}}

轮流赡养安排：
1. 由{{child_count}}名子女轮流赡养
2. 轮流周期：{{rotation_period}}
3. 首轮由{{start_person}}开始

签订日期：{{sign_date}}`,
    instructions: [
      '请根据实际情况填写子女人数和轮流周期。',
      '建议明确每次轮流交接的具体日期和方式。',
      '协议应由所有子女签字确认。',
    ],
    legalNotes: [
      '轮流赡养是赡养方式之一，但不免除任何子女的赡养义务。',
      '轮流期间发生的医疗等特殊费用，应另行协商分担。',
    ],
  },

  // Loan Document Templates
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
      { id: 'lender_id', label: '出借人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
      { id: 'borrower_name', label: '借款人姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'borrower_id', label: '借款人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
      { id: 'loan_amount', label: '借款金额（元）', placeholder: '例如：50000', type: 'number', required: true },
      { id: 'loan_amount_words', label: '借款金额（大写）', placeholder: '例如：伍万元整', type: 'text', required: true },
      { id: 'interest_rate', label: '年利率（%）', placeholder: '例如：6（不超过15.4%）', type: 'number', required: false },
      { id: 'repayment_date', label: '还款日期', placeholder: '例如：2025年1月1日', type: 'date', required: true },
      { id: 'write_date', label: '书写日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `借条

出借人：{{lender_name}}，身份证号：{{lender_id}}

借款人：{{borrower_name}}，身份证号：{{borrower_id}}

今借款人因个人需要，向出借人借款人民币{{loan_amount}}元（大写：{{loan_amount_words}}）。

{{#interest_rate}}
借款利息：年利率{{interest_rate}}%，按月计息。
{{/interest_rate}}
{{^interest_rate}}
本次借款为无息借款。
{{/interest_rate}}

还款日期：借款人承诺于{{repayment_date}}前一次性归还全部借款本金{{#interest_rate}}及利息{{/interest_rate}}。

特此立据为证。

借款人（签字）：________________
身份证号：{{borrower_id}}

日期：{{write_date}}

见证人（选填）：________________`,
    instructions: [
      '借款金额务必同时写明阿拉伯数字和大写金额，两者必须一致。',
      '根据法律规定，民间借贷年利率不得超过15.4%（2024年标准），超过部分不受法律保护。',
      '建议由借款人亲笔书写借条全文并签字，证明力更强。',
      '如采用打印方式，借款人和出借人均应签字。',
      '建议有第三方见证人在场并签字。',
      '借款交付时建议通过银行转账，保留转账记录作为证据。',
    ],
    legalNotes: [
      '根据《民法典》，借款合同采用书面形式，但自然人之间借款可以采用口头形式（不建议）。',
      '出借人应保留借条原件和借款支付凭证（如转账记录）。',
      '借款利率不得违反国家有关规定，超过法定上限的部分无效。',
      '借款到期不还，出借人可向法院起诉，诉讼时效为3年。',
    ],
  },
  {
    id: 'template_loan_002',
    categoryId: 'loan',
    name: '欠条（标准版）',
    description: '适用于已发生的欠款，明确欠款原因、金额和还款期限。',
    difficulty: 'easy',
    estimatedTime: 5,
    downloads: 4321,
    fields: [
      { id: 'creditor_name', label: '债权人姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'debtor_name', label: '欠款人姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'debtor_id', label: '欠款人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
      { id: 'debt_reason', label: '欠款原因', placeholder: '例如：货款、服务费等', type: 'text', required: true },
      { id: 'debt_amount', label: '欠款金额（元）', placeholder: '例如：30000', type: 'number', required: true },
      { id: 'debt_amount_words', label: '欠款金额（大写）', placeholder: '例如：叁万元整', type: 'text', required: true },
      { id: 'repayment_date', label: '还款日期', placeholder: '例如：2025年1月1日', type: 'date', required: true },
      { id: 'write_date', label: '书写日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `欠条

欠款人：{{debtor_name}}，身份证号：{{debtor_id}}

今因{{debt_reason}}，欠{{creditor_name}}人民币{{debt_amount}}元（大写：{{debt_amount_words}}）。

还款期限：欠款人承诺于{{repayment_date}}前一次性偿还上述欠款。

如逾期不还，欠款人愿意承担违约责任并支付逾期利息。

特此立据为证。

欠款人（签字）：________________
身份证号：{{debtor_id}}

日期：{{write_date}}`,
    instructions: [
      '欠条与借条的区别：欠条是已经发生的债务，借条是借款行为。',
      '务必写明欠款原因，避免日后产生争议。',
      '金额必须同时写明数字和大写。',
      '建议由欠款人亲笔书写并签字。',
      '债权人应妥善保管欠条原件。',
    ],
    legalNotes: [
      '欠条的诉讼时效从约定的还款期限届满之日起计算，为3年。',
      '如未约定还款期限，债权人可随时要求还款，诉讼时效从要求还款之日起计算。',
      '欠条应由欠款人签字，如有担保人，担保人也应签字。',
    ],
  },

  // Authorization Templates
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
      { id: 'agent_relationship', label: '受托人与委托人关系', placeholder: '例如：儿子、女儿、朋友等', type: 'text', required: true },
      { id: 'matter', label: '委托事项', placeholder: '请详细描述委托办理的具体事项', type: 'multiline', required: true },
      { id: 'authority_scope', label: '授权范围', placeholder: '例如：全权办理、仅限咨询等', type: 'text', required: true },
      { id: 'valid_period', label: '有效期限', placeholder: '例如：至2024年12月31日', type: 'text', required: true },
      { id: 'sign_date', label: '签署日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `授权委托书

委托人：{{principal_name}}，身份证号：{{principal_id}}

受托人：{{agent_name}}，身份证号：{{agent_id}}，与委托人关系：{{agent_relationship}}

委托人因个人原因，不便亲自办理相关事宜，特委托受托人为委托人的代理人，代为办理如下事项：

一、委托事项
{{matter}}

二、授权范围
{{authority_scope}}

三、委托期限
本授权委托书有效期限为：{{valid_period}}

四、其他约定
1. 受托人在办理上述委托事项时所签署的文件，委托人均予以承认。
2. 受托人有转委托权/受托人无转委托权（请选择）。
3. 本授权委托书一式两份，委托人和受托人各执一份，具有同等法律效力。

委托人签字：________________
日期：{{sign_date}}

受托人签字：________________（表示接受委托）
日期：{{sign_date}}`,
    instructions: [
      '委托事项应具体明确，不宜过于宽泛。',
      '授权范围应清晰，避免"全权处理"等模糊表述，应列明具体权限。',
      '重要事项（如房产买卖、大额取款等）建议进行公证。',
      '委托人和受托人均需签字，最好按手印。',
      '受托人办理事务时，应携带本授权委托书原件及双方身份证。',
    ],
    legalNotes: [
      '根据《民法典》，委托代理应采用书面形式。',
      '委托人可以随时撤销委托，但应及时通知受托人和相关第三方。',
      '受托人应在授权范围内办理事务，超越权限的行为，委托人不承担责任（除非追认）。',
      '涉及重大财产处分、诉讼代理等，建议办理公证授权委托书。',
    ],
  },

  // Property Templates
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
      { id: 'donee_id', label: '受赠人身份证号', placeholder: '请输入身份证号', type: 'text', required: true },
      { id: 'property_description', label: '赠与财产描述', placeholder: '请详细描述赠与的财产（房产/现金/股权等）', type: 'multiline', required: true },
      { id: 'property_value', label: '财产价值（元）', placeholder: '例如：1000000', type: 'number', required: false },
      { id: 'conditions', label: '赠与条件', placeholder: '例如：用于受赠人购房，不得转让给第三方等（选填）', type: 'multiline', required: false },
      { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `财产赠与协议书

赠与人：{{donor_name}}，身份证号：{{donor_id}}

受赠人：{{donee_name}}，身份证号：{{donee_id}}

赠与人与受赠人在平等自愿的基础上，就财产赠与事宜达成如下协议：

一、赠与财产
赠与人自愿将其所有的下列财产无偿赠与受赠人：
{{property_description}}

{{#property_value}}
上述财产价值约为人民币{{property_value}}元。
{{/property_value}}

二、财产交付
1. 赠与人应于本协议签订后____日内将上述财产交付给受赠人。
2. 如赠与财产需要办理过户登记手续的，双方应共同办理，相关费用由____方承担（请协商确定）。

{{#conditions}}
三、赠与条件
{{conditions}}

如受赠人违反上述条件，赠与人有权撤销赠与。
{{/conditions}}

{{^conditions}}
三、无附加条件
本次赠与为无附加条件的赠与。
{{/conditions}}

四、赠与的撤销
1. 在财产权利转移之前，赠与人可以撤销赠与。
2. 经过公证的赠与合同或具有救灾、扶贫、助残等公益、道德义务性质的赠与合同，不得撤销。
3. 受赠人有下列情形之一的，赠与人可以撤销赠与：
   （1）严重侵害赠与人或者赠与人近亲属的合法权益；
   （2）对赠与人有扶养义务而不履行；
   （3）不履行赠与合同约定的义务。

五、其他约定
1. 本协议自双方签字之日起生效。
2. 本协议一式两份，赠与人和受赠人各执一份，具有同等法律效力。

赠与人签字：________________
日期：{{sign_date}}

受赠人签字：________________（表示接受赠与）
日期：{{sign_date}}`,
    instructions: [
      '赠与财产应描述清楚，如是房产，应写明地址、面积、产权证号等。',
      '赠与可以附条件，也可以不附条件，请根据实际情况选择。',
      '房产、车辆等需要登记的财产，赠与后应及时办理过户手续。',
      '赠与协议建议进行公证，公证后的赠与不可随意撤销。',
      '赠与可能涉及税费（如房产赠与的契税、个税），请事先了解。',
    ],
    legalNotes: [
      '根据《民法典》第657-666条，赠与人可以在财产权利转移之前撤销赠与。',
      '经过公证的赠与合同，不得撤销。',
      '赠与的财产有瑕疵的，赠与人一般不承担责任，但故意隐瞒瑕疵或保证无瑕疵的除外。',
      '赠与可能涉及税费，具体请咨询税务部门。',
    ],
  },

  // Guardianship Templates
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
      { id: 'guardian_relationship', label: '监护人与被监护人关系', placeholder: '例如：子女、侄子、朋友等', type: 'text', required: true },
      { id: 'trigger_condition', label: '监护启动条件', placeholder: '例如：经医院诊断为无民事行为能力或限制民事行为能力', type: 'multiline', required: true },
      { id: 'supervisor_name', label: '监护监督人姓名', placeholder: '请输入姓名（选填）', type: 'text', required: false },
      { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `意定监护协议书

被监护人：{{ward_name}}，身份证号：{{ward_id}}

监护人：{{guardian_name}}，身份证号：{{guardian_id}}，与被监护人关系：{{guardian_relationship}}

{{#supervisor_name}}
监护监督人：{{supervisor_name}}
{{/supervisor_name}}

鉴于被监护人为充分保障自己年老或丧失民事行为能力后的合法权益，根据《中华人民共和国民法典》第三十三条的规定，在具有完全民事行为能力时，与监护人协商一致，自愿订立本意定监护协议。

一、监护的启动条件
当出现以下情形之一时，本监护协议启动，监护人开始履行监护职责：
{{trigger_condition}}

二、监护人的职责
监护人应当履行以下职责：
1. 保护被监护人的人身权利、财产权利以及其他合法权益；
2. 负责被监护人的生活照料，保障被监护人的基本生活需要；
3. 代理被监护人进行民事活动，包括但不限于：
   （1）管理被监护人的财产，包括银行存款、房产、股票等；
   （2）代为签署医疗文件，决定医疗方案；
   （3）代为办理社保、养老金等领取事宜；
   （4）代为处理法律事务；
4. 尊重被监护人的真实意愿，维护被监护人的尊严；
5. 不得损害被监护人的利益。

三、监护人的权利
1. 监护人有权获得合理的监护报酬（具体金额为：每月____元/无报酬，请选择）；
2. 监护人因履行监护职责产生的必要费用，从被监护人财产中支出；
3. 监护人有权拒绝被监护人的不合理要求。

四、财产管理
1. 被监护人的财产清单（房产、存款、股票等）见附件（应另行列明）；
2. 监护人应当妥善管理被监护人的财产，不得侵占、挪用；
3. 监护人处分被监护人的重大财产（如房产出售），应当符合被监护人的最大利益；
4. 监护人应当定期向{{#supervisor_name}}监护监督人{{/supervisor_name}}{{^supervisor_name}}相关部门{{/supervisor_name}}报告财产管理情况。

五、医疗决策
1. 监护人有权代为签署医疗同意书，决定医疗方案；
2. 对于重大医疗决策（如手术），监护人应慎重考虑，必要时征询专业医生意见；
3. 监护人应尊重被监护人生前的医疗意愿（如有）。

{{#supervisor_name}}
六、监护监督
1. 监护监督人有权监督监护人履行监护职责；
2. 如发现监护人不当履行职责，监护监督人有权向居委会、村委会、民政部门或人民法院报告；
3. 监护监督人不承担监护责任。
{{/supervisor_name}}

七、监护的变更和终止
1. 被监护人恢复民事行为能力的，本协议终止；
2. 被监护人去世的，本协议终止；
3. 监护人丧失监护能力或不适合继续担任监护人的，应更换监护人；
4. 被监护人在有民事行为能力时，可以变更或解除本协议。

八、协议的效力
1. 本协议经双方签字后成立，自监护启动条件满足时生效；
2. 本协议优先于法定监护；
3. 建议将本协议进行公证。

九、其他约定
1. 本协议一式三份，被监护人、监护人{{#supervisor_name}}、监护监督人{{/supervisor_name}}各执一份，具有同等法律效力；
2. 本协议未尽事宜，由双方协商解决。

被监护人签字：________________
日期：{{sign_date}}

监护人签字：________________（表示接受监护）
日期：{{sign_date}}

{{#supervisor_name}}
监护监督人签字：________________（表示接受监督职责）
日期：{{sign_date}}
{{/supervisor_name}}`,
    instructions: [
      '意定监护协议应在被监护人具有完全民事行为能力时签订。',
      '监护人应选择值得信赖、有监护能力的人。',
      '强烈建议进行公证，公证后的意定监护协议效力更强。',
      '建议设立监护监督人，对监护人进行监督。',
      '协议中应明确列明被监护人的财产清单，作为附件。',
      '意定监护协议签订后，应妥善保管，并告知家人、律师等。',
    ],
    legalNotes: [
      '根据《民法典》第33条，意定监护优先于法定监护。',
      '意定监护协议可以指定监护人，也可以指定监护监督人。',
      '意定监护协议建议进行公证，未公证的协议也有效，但公证后效力更强。',
      '监护人应当按照最有利于被监护人的原则履行监护职责。',
      '监护人不履行监护职责或侵害被监护人权益的，应承担法律责任。',
    ],
  },

  // Other Templates
  {
    id: 'template_other_001',
    categoryId: 'other',
    name: '家庭财产分割协议',
    description: '适用于家庭成员之间协商分割共同财产的情况。',
    difficulty: 'hard',
    estimatedTime: 18,
    downloads: 1543,
    fields: [
      { id: 'party_a_name', label: '甲方姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'party_b_name', label: '乙方姓名', placeholder: '请输入姓名', type: 'text', required: true },
      { id: 'relationship', label: '双方关系', placeholder: '例如：夫妻、兄弟姐妹等', type: 'text', required: true },
      { id: 'property_list', label: '财产清单', placeholder: '请详细列明需要分割的财产', type: 'multiline', required: true },
      { id: 'division_plan', label: '分割方案', placeholder: '请说明各方分得的财产', type: 'multiline', required: true },
      { id: 'sign_date', label: '签订日期', placeholder: '例如：2024年1月1日', type: 'date', required: true },
    ],
    content: `家庭财产分割协议

甲方：{{party_a_name}}
乙方：{{party_b_name}}
双方关系：{{relationship}}

甲乙双方在平等自愿的基础上，就共同财产的分割达成如下协议：

一、财产范围
需要分割的财产包括：
{{property_list}}

二、分割方案
{{division_plan}}

三、债务承担
（如有共同债务，应明确由谁承担）

四、其他约定
1. 本协议签订后，双方应按约定履行。
2. 本协议一式两份，甲乙双方各执一份。

甲方签字：________________
日期：{{sign_date}}

乙方签字：________________
日期：{{sign_date}}`,
    instructions: [
      '财产分割应全面、详细，避免遗漏。',
      '如有债务，应明确由谁承担。',
      '涉及房产、车辆等需要登记的财产，协议签订后应及时办理过户。',
      '重大财产分割建议进行公证。',
    ],
    legalNotes: [
      '财产分割协议应由双方自愿签订，不得欺诈、胁迫。',
      '协议签订后双方应履行，如一方不履行，另一方可向法院起诉。',
    ],
  },
  {
    id: 'template_other_002',
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
      '承诺人应确保自己有能力履行承诺。',
      '承诺书应由承诺人亲笔签字。',
    ],
    legalNotes: [
      '承诺书是承诺人单方作出的意思表示。',
      '承诺人应按照承诺内容履行，否则可能承担违约责任。',
    ],
  },
];

// ==================== Helper Functions ====================

const getDifficultyLabel = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return '简单';
    case 'medium':
      return '中等';
    case 'hard':
      return '复杂';
  }
};

const getDifficultyColor = (difficulty: 'easy' | 'medium' | 'hard'): string => {
  switch (difficulty) {
    case 'easy':
      return '#52c41a';
    case 'medium':
      return '#1890ff';
    case 'hard':
      return '#faad14';
  }
};

// Simple template engine to replace placeholders
const renderTemplate = (template: string, data: FormData): string => {
  let result = template;

  // Replace simple {{field}} placeholders
  Object.keys(data).forEach(key => {
    const value = data[key];
    const placeholder = new RegExp(`{{${key}}}`, 'g');
    result = result.replace(placeholder, value || '');
  });

  // Handle conditional blocks {{#field}}...{{/field}}
  Object.keys(data).forEach(key => {
    const value = data[key];
    const conditionalStart = new RegExp(`{{#${key}}}`, 'g');
    const conditionalEnd = new RegExp(`{{/${key}}}`, 'g');

    if (value && value.trim() !== '') {
      // Keep the content, remove the conditional markers
      result = result.replace(conditionalStart, '');
      result = result.replace(conditionalEnd, '');
    } else {
      // Remove the entire conditional block
      const blockPattern = new RegExp(`{{#${key}}}[\\s\\S]*?{{/${key}}}`, 'g');
      result = result.replace(blockPattern, '');
    }
  });

  // Handle negative conditional blocks {{^field}}...{{/field}}
  Object.keys(data).forEach(key => {
    const value = data[key];
    const negConditionalStart = new RegExp(`{{\\^${key}}}`, 'g');
    const negConditionalEnd = new RegExp(`{{/${key}}}`, 'g');

    if (!value || value.trim() === '') {
      // Keep the content, remove the conditional markers
      result = result.replace(negConditionalStart, '');
      result = result.replace(negConditionalEnd, '');
    } else {
      // Remove the entire conditional block
      const blockPattern = new RegExp(`{{\\^${key}}}[\\s\\S]*?{{/${key}}}`, 'g');
      result = result.replace(blockPattern, '');
    }
  });

  return result;
};

// ==================== Main Component ====================

const DocumentTemplateScreen: React.FC<any> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<TemplateCategory | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<DocumentTemplate | null>(null);
  const [templateList, setTemplateList] = useState<DocumentTemplate[]>([]);

  // Form state
  const [formData, setFormData] = useState<FormData>({});
  const [generatedDocument, setGeneratedDocument] = useState<string>('');

  // ==================== Navigation Handlers ====================

  const handleCategoryPress = (category: TemplateCategory) => {
    setSelectedCategory(category);

    // Filter templates by category
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

    // Validate required fields
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

    // Generate document
    const document = renderTemplate(selectedTemplate.content, formData);
    setGeneratedDocument(document);
    setCurrentStep('generatedDocument');
  };

  const handleDownload = (format: 'word' | 'pdf') => {
    // Mock download functionality
    Alert.alert(
      '下载成功',
      `文书已保存为${format === 'word' ? 'Word' : 'PDF'}格式\n\n提示：实际应用中，此处会调用文件下载功能，将文书保存到手机存储。`,
      [{ text: '确定' }]
    );
  };

  const handleBackPress = () => {
    if (currentStep === 'generatedDocument') {
      Alert.alert(
        '提示',
        '返回后将丢失已生成的文书，确定返回吗？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确定',
            onPress: () => {
              setCurrentStep('templateFill');
              setGeneratedDocument('');
            },
          },
        ]
      );
    } else if (currentStep === 'templateFill') {
      Alert.alert(
        '提示',
        '返回后将丢失已填写的内容，确定返回吗？',
        [
          { text: '取消', style: 'cancel' },
          {
            text: '确定',
            onPress: () => {
              setCurrentStep('templatePreview');
              setFormData({});
            },
          },
        ]
      );
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
    <TouchableOpacity
      key={category.id}
      style={styles.categoryCard}
      onPress={() => handleCategoryPress(category)}
    >
      <View style={[styles.categoryIconContainer, { backgroundColor: category.color + '20' }]}>
        <Ionicons name={category.icon} size={28} color={category.color} />
      </View>
      <View style={styles.categoryInfo}>
        <Text style={styles.categoryName}>{category.name}</Text>
        <Text style={styles.categoryDescription}>{category.description}</Text>
        <View style={styles.categoryMeta}>
          <Ionicons name="document" size={14} color="#666" />
          <Text style={styles.categoryTemplateCount}> {category.templateCount} 个模板</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#999" />
    </TouchableOpacity>
  );

  const renderTemplateCard = (template: DocumentTemplate) => (
    <TouchableOpacity
      key={template.id}
      style={styles.templateCard}
      onPress={() => handleTemplatePress(template)}
    >
      <View style={styles.templateHeader}>
        <Text style={styles.templateName}>{template.name}</Text>
        <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(template.difficulty) + '20' }]}>
          <Text style={[styles.difficultyText, { color: getDifficultyColor(template.difficulty) }]}>
            {getDifficultyLabel(template.difficulty)}
          </Text>
        </View>
      </View>
      <Text style={styles.templateDescription}>{template.description}</Text>
      <View style={styles.templateMeta}>
        <View style={styles.templateMetaItem}>
          <Ionicons name="time" size={14} color="#999" />
          <Text style={styles.templateMetaText}> 约{template.estimatedTime}分钟</Text>
        </View>
        <View style={styles.templateMetaItem}>
          <Ionicons name="download" size={14} color="#999" />
          <Text style={styles.templateMetaText}> {template.downloads}次下载</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderFormField = (field: TemplateField) => {
    const value = formData[field.id] || '';

    return (
      <View key={field.id} style={styles.formField}>
        <Text style={styles.formLabel}>
          {field.label}
          {field.required && <Text style={styles.requiredMark}> *</Text>}
        </Text>
        {field.helpText && <Text style={styles.formHelpText}>{field.helpText}</Text>}
        {field.type === 'multiline' ? (
          <TextInput
            style={[styles.formInput, styles.formTextarea]}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(text) => setFormData({ ...formData, [field.id]: text })}
            multiline
            numberOfLines={4}
            placeholderTextColor="#999"
          />
        ) : (
          <TextInput
            style={styles.formInput}
            placeholder={field.placeholder}
            value={value}
            onChangeText={(text) => setFormData({ ...formData, [field.id]: text })}
            keyboardType={field.type === 'number' ? 'numeric' : 'default'}
            placeholderTextColor="#999"
          />
        )}
      </View>
    );
  };

  // ==================== Screen Views ====================

  const renderCategoriesView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>文书模板库</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Content */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.banner}>
          <View style={styles.bannerContent}>
            <Ionicons name="document-text" size={40} color="#1890ff" />
            <Text style={styles.bannerTitle}>专业法律文书模板</Text>
            <Text style={styles.bannerSubtitle}>在线填写 · 自动生成 · 免费下载</Text>
          </View>
        </View>

        {/* Categories */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>模板分类</Text>
            <Text style={styles.sectionSubtitle}>选择您需要的文书类型</Text>
          </View>
          {TEMPLATE_CATEGORIES.map(category => renderCategoryCard(category))}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );

  const renderTemplateListView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{selectedCategory?.name}</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Template List */}
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.templateListContainer}>
          {templateList.map(template => renderTemplateCard(template))}
        </View>
        <View style={{ height: 30 }} />
      </ScrollView>
    </View>
  );

  const renderTemplatePreviewView = () => {
    if (!selectedTemplate) return null;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>模板预览</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Template Info */}
          <View style={styles.previewHeader}>
            <Text style={styles.previewTitle}>{selectedTemplate.name}</Text>
            <Text style={styles.previewDescription}>{selectedTemplate.description}</Text>
            <View style={styles.previewMeta}>
              <View style={[styles.difficultyBadge, { backgroundColor: getDifficultyColor(selectedTemplate.difficulty) + '20' }]}>
                <Text style={[styles.difficultyText, { color: getDifficultyColor(selectedTemplate.difficulty) }]}>
                  {getDifficultyLabel(selectedTemplate.difficulty)}
                </Text>
              </View>
              <View style={styles.previewMetaItem}>
                <Ionicons name="time" size={14} color="#999" />
                <Text style={styles.previewMetaText}> 约{selectedTemplate.estimatedTime}分钟</Text>
              </View>
            </View>
          </View>

          {/* Instructions */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>填写指引</Text>
            {selectedTemplate.instructions.map((instruction, index) => (
              <View key={index} style={styles.infoListItem}>
                <Text style={styles.infoListBullet}>• </Text>
                <Text style={styles.infoListText}>{instruction}</Text>
              </View>
            ))}
          </View>

          {/* Legal Notes */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>法律提示</Text>
            {selectedTemplate.legalNotes.map((note, index) => (
              <View key={index} style={styles.infoListItem}>
                <Ionicons name="information-circle" size={16} color="#1890ff" style={styles.infoIcon} />
                <Text style={styles.infoListText}>{note}</Text>
              </View>
            ))}
          </View>

          {/* Template Preview */}
          <View style={styles.infoSection}>
            <Text style={styles.infoSectionTitle}>模板预览</Text>
            <View style={styles.templatePreview}>
              <ScrollView style={styles.templatePreviewScroll} nestedScrollEnabled>
                <Text style={styles.templatePreviewText}>{selectedTemplate.content}</Text>
              </ScrollView>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </ScrollView>

        {/* Bottom Actions */}
        <View style={styles.bottomActions}>
          <TouchableOpacity style={styles.primaryButton} onPress={handleStartFilling}>
            <Ionicons name="create" size={20} color="#fff" />
            <Text style={styles.primaryButtonText}> 开始填写</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderTemplateFillView = () => {
    if (!selectedTemplate) return null;

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>填写文书</Text>
          <View style={styles.headerRight} />
        </View>

        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            <View style={styles.fillHeader}>
              <Text style={styles.fillTitle}>{selectedTemplate.name}</Text>
              <Text style={styles.fillHint}>请填写以下信息，带*号为必填项</Text>
            </View>

            <View style={styles.formContainer}>
              {selectedTemplate.fields.map(field => renderFormField(field))}
            </View>

            <View style={{ height: 100 }} />
          </ScrollView>

          {/* Bottom Actions */}
          <View style={styles.bottomActions}>
            <TouchableOpacity style={styles.primaryButton} onPress={handleGenerateDocument}>
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={styles.primaryButtonText}> 生成文书</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </View>
    );
  };

  const renderGeneratedDocumentView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>生成的文书</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.documentContainer}>
          <Text style={styles.documentText}>{generatedDocument}</Text>
        </View>

        <View style={styles.downloadSection}>
          <Text style={styles.downloadTitle}>下载文书</Text>
          <View style={styles.downloadButtons}>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload('word')}
            >
              <Ionicons name="document" size={24} color="#1890ff" />
              <Text style={styles.downloadButtonText}>Word格式</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={() => handleDownload('pdf')}
            >
              <Ionicons name="document-text" size={24} color="#ff4d4f" />
              <Text style={styles.downloadButtonText}>PDF格式</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.noteSection}>
          <Ionicons name="information-circle" size={20} color="#faad14" />
          <Text style={styles.noteText}>
            重要提示：生成的文书仅供参考，请仔细核对内容，必要时请咨询专业律师。涉及重大事项的文书建议进行公证。
          </Text>
        </View>

        <View style={{ height: 30 }} />
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

// ==================== Styles ====================

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
  },
  headerRight: {
    width: 32,
  },

  // Content
  content: {
    flex: 1,
  },

  // Banner
  banner: {
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
  },
  bannerContent: {
    alignItems: 'center',
  },
  bannerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginTop: 12,
  },
  bannerSubtitle: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },

  // Section
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#999',
  },

  // Category Card
  categoryCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    padding: 16,
    borderRadius: 12,
  },
  categoryIconContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryInfo: {
    flex: 1,
    marginLeft: 12,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  categoryDescription: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  categoryMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryTemplateCount: {
    fontSize: 12,
    color: '#666',
  },

  // Template List
  templateListContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Template Card
  templateCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  templateHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  templateName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginRight: 8,
  },
  difficultyBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  difficultyText: {
    fontSize: 11,
    fontWeight: '500',
  },
  templateDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  templateMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  templateMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
  },
  templateMetaText: {
    fontSize: 12,
    color: '#999',
  },

  // Template Preview
  previewHeader: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  previewTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  previewDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  previewMeta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  previewMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 12,
  },
  previewMetaText: {
    fontSize: 13,
    color: '#999',
  },

  // Info Section
  infoSection: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  infoSectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  infoListItem: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  infoListBullet: {
    fontSize: 14,
    color: '#1890ff',
    marginRight: 8,
    fontWeight: 'bold',
  },
  infoIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  infoListText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },

  // Template Preview Box
  templatePreview: {
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    padding: 12,
    maxHeight: 300,
  },
  templatePreviewScroll: {
    maxHeight: 280,
  },
  templatePreviewText: {
    fontSize: 13,
    color: '#333',
    lineHeight: 22,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Template Fill
  fillHeader: {
    backgroundColor: '#fff',
    padding: 16,
    marginBottom: 12,
  },
  fillTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  fillHint: {
    fontSize: 14,
    color: '#999',
  },

  // Form
  formContainer: {
    backgroundColor: '#fff',
    padding: 16,
  },
  formField: {
    marginBottom: 20,
  },
  formLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#333',
    marginBottom: 8,
  },
  requiredMark: {
    color: '#ff4d4f',
  },
  formHelpText: {
    fontSize: 13,
    color: '#999',
    marginBottom: 8,
  },
  formInput: {
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 15,
    color: '#333',
    backgroundColor: '#fff',
  },
  formTextarea: {
    height: 100,
    textAlignVertical: 'top',
  },

  // Generated Document
  documentContainer: {
    backgroundColor: '#fff',
    margin: 16,
    padding: 16,
    borderRadius: 12,
  },
  documentText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 26,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },

  // Download Section
  downloadSection: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
  },
  downloadTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 16,
  },
  downloadButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  downloadButton: {
    alignItems: 'center',
    padding: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    borderRadius: 8,
    width: '45%',
  },
  downloadButtonText: {
    fontSize: 14,
    color: '#333',
    marginTop: 8,
  },

  // Note Section
  noteSection: {
    flexDirection: 'row',
    backgroundColor: '#fffbe6',
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#faad14',
  },
  noteText: {
    flex: 1,
    fontSize: 13,
    color: '#666',
    lineHeight: 20,
    marginLeft: 8,
  },

  // Bottom Actions
  bottomActions: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  primaryButton: {
    flexDirection: 'row',
    backgroundColor: '#1890ff',
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
});

export default DocumentTemplateScreen;
