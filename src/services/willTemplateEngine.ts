/**
 * 遗嘱模板引擎
 * 根据用户输入生成符合法律要求的遗嘱文本
 */

import { Will, WillType, Beneficiary, Estate } from '../types/legalService';

/**
 * 合规性检查结果
 */
export interface ComplianceCheckResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * 生成的遗嘱文档
 */
export interface GeneratedWill {
  content: string;
  complianceCheck: ComplianceCheckResult;
  instructions: string[];
}

/**
 * 生成自书遗嘱模板
 */
export const generateSelfWrittenWillTemplate = (will: Will): GeneratedWill => {
  const { testatorName, testatorIdNumber, testatorAge, estates, beneficiaries, executor, specialClauses } = will;

  // 生成遗嘱内容
  let content = `遗  嘱

立遗嘱人：${testatorName}
身份证号：${testatorIdNumber}
年龄：${testatorAge}岁

本人${testatorName}，在神志清楚、意识清晰的情况下，特立此遗嘱，对本人所有的财产，在本人去世后，作如下处理：

一、遗产清单

本人遗产包括但不限于以下财产：

`;

  // 添加财产清单
  estates.forEach((estate, index) => {
    content += `${index + 1}. `;
    switch (estate.type) {
      case 'real_estate':
        content += `房产：${estate.description}`;
        if (estate.location) content += `，位于${estate.location}`;
        break;
      case 'bank_deposit':
        content += `银行存款：${estate.description}`;
        if (estate.location) content += `，账号：${estate.location}`;
        break;
      case 'securities':
        content += `股票证券：${estate.description}`;
        break;
      case 'vehicle':
        content += `车辆：${estate.description}`;
        break;
      case 'other':
        content += `其他财产：${estate.description}`;
        break;
    }
    content += `，估值约人民币${estate.estimatedValue.toLocaleString()}元。\n`;
  });

  content += `\n二、遗产分配

`;

  // 添加受益人信息
  beneficiaries.forEach((beneficiary, index) => {
    content += `${index + 1}. ${beneficiary.name}（${beneficiary.relationship}，身份证号：${beneficiary.idNumber || '待补充'}），继承${beneficiary.share}。\n`;
  });

  // 添加特殊条款
  if (specialClauses && specialClauses.length > 0) {
    content += `\n三、特殊条款

`;
    specialClauses.forEach((clause, index) => {
      content += `${index + 1}. ${clause}\n`;
    });
  }

  // 添加执行人信息
  if (executor) {
    content += `\n${specialClauses && specialClauses.length > 0 ? '四' : '三'}、遗嘱执行人

本人指定 ${executor} 为本遗嘱的执行人，负责按照本遗嘱的内容处理本人的遗产。

`;
  }

  content += `\n${specialClauses && specialClauses.length > 0 ? (executor ? '五' : '四') : (executor ? '四' : '三')}、其他说明

1. 本遗嘱为本人真实意思表示，任何人不得更改。
2. 本遗嘱自本人去世之日起生效。
3. 如本遗嘱与之前所立遗嘱有冲突，以本遗嘱为准。

立遗嘱人：_____________（签名并按指印）
立遗嘱日期：____年____月____日
`;

  // 合规性检查
  const complianceCheck = checkSelfWrittenWillCompliance(will);

  // 填写指引
  const instructions = [
    '本遗嘱必须由您本人亲笔书写，不得打印或由他人代写',
    '必须使用黑色或蓝色钢笔、签字笔书写，字迹清晰',
    '必须亲笔签名，并按上指印（建议用印泥）',
    '必须注明具体的年、月、日（如：2024年1月15日）',
    '不得有涂改，如需修改，应在修改处签名并注明日期',
    '建议将遗嘱放在安全可靠的地方，并告知执行人遗嘱位置',
    '建议保留遗嘱复印件，并由见证人或律师保存',
    '如有能力，建议进行公证，增强法律效力',
  ];

  return {
    content,
    complianceCheck,
    instructions,
  };
};

/**
 * 生成代书遗嘱模板
 */
export const generateWitnessedWillTemplate = (will: Will): GeneratedWill => {
  const { testatorName, testatorIdNumber, testatorAge, estates, beneficiaries, executor, specialClauses, witnesses } = will;

  let content = `遗  嘱

立遗嘱人：${testatorName}
身份证号：${testatorIdNumber}
年龄：${testatorAge}岁

本人${testatorName}，因身体原因无法亲笔书写，特委托他人代书本遗嘱。本人在神志清楚、意识清晰的情况下，对本人所有的财产，在本人去世后，作如下处理：

一、遗产清单

本人遗产包括但不限于以下财产：

`;

  // 添加财产清单
  estates.forEach((estate, index) => {
    content += `${index + 1}. `;
    switch (estate.type) {
      case 'real_estate':
        content += `房产：${estate.description}，位于${estate.location}，估值约${estate.estimatedValue.toLocaleString()}元`;
        break;
      case 'bank_deposit':
        content += `银行存款：${estate.description}，账号${estate.location}，金额约${estate.estimatedValue.toLocaleString()}元`;
        break;
      case 'securities':
        content += `股票证券：${estate.description}，价值约${estate.estimatedValue.toLocaleString()}元`;
        break;
      case 'vehicle':
        content += `车辆：${estate.description}，价值约${estate.estimatedValue.toLocaleString()}元`;
        break;
      case 'other':
        content += `其他财产：${estate.description}，价值约${estate.estimatedValue.toLocaleString()}元`;
        break;
    }
    content += `\n`;
  });

  content += `\n二、遗产分配

`;

  beneficiaries.forEach((beneficiary, index) => {
    content += `${index + 1}. ${beneficiary.name}（${beneficiary.relationship}），继承${beneficiary.share}。\n`;
  });

  if (specialClauses && specialClauses.length > 0) {
    content += `\n三、特殊条款

`;
    specialClauses.forEach((clause, index) => {
      content += `${index + 1}. ${clause}\n`;
    });
  }

  if (executor) {
    content += `\n${specialClauses && specialClauses.length > 0 ? '四' : '三'}、遗嘱执行人

本人指定 ${executor} 为本遗嘱的执行人。

`;
  }

  content += `\n本遗嘱为立遗嘱人真实意思表示，由代书人根据立遗嘱人口述记录如下：

立遗嘱人：_____________（签名并按指印）
代书人：_____________（签名）
日期：____年____月____日

见证人：
1. _____________（签名）  身份证号：_______________
2. _____________（签名）  身份证号：_______________

见证人声明：
我们作为见证人，见证了立遗嘱人${testatorName}在神志清楚的情况下口述遗嘱内容，代书人如实记录。立遗嘱人在遗嘱上签名并按指印，我们在场见证并签名。
`;

  const complianceCheck = checkWitnessedWillCompliance(will);

  const instructions = [
    '代书遗嘱必须由两名以上无利害关系的见证人在场见证',
    '见证人不能是受益人、与受益人有利害关系的人',
    '见证人应为完全民事行为能力人（年满18岁，精神正常）',
    '代书人可以是见证人之一',
    '立遗嘱人必须在遗嘱上签名并按指印',
    '代书人和所有见证人都必须签名',
    '必须注明具体日期',
    '建议对代书过程进行录音或录像，以备日后证明',
  ];

  return {
    content,
    complianceCheck,
    instructions,
  };
};

/**
 * 生成录音录像遗嘱指引
 */
export const generateAudioVideoWillGuidelines = (will: Will): GeneratedWill => {
  const { testatorName, estates, beneficiaries, executor } = will;

  const content = `录音录像遗嘱录制指引

一、录制前准备
1. 准备录音或录像设备（手机、摄像机等）
2. 选择安静、光线充足的环境
3. 准备好遗产清单和受益人信息
4. 邀请两名以上无利害关系的见证人到场

二、录制内容要求

【开场白】
我是${testatorName}，现在的时间是____年____月____日____时____分。我在神志清楚、意识清晰的情况下，自愿录制此录音/录像遗嘱。

【见证人介绍】
在场的见证人有：
1. （姓名）___________，身份证号_______________
2. （姓名）___________，身份证号_______________

【遗产说明】
我的遗产包括：
${estates.map((e, i) => `${i + 1}. ${e.description}，价值约${e.estimatedValue.toLocaleString()}元`).join('\n')}

【遗产分配】
我决定将遗产分配如下：
${beneficiaries.map((b, i) => `${i + 1}. ${b.name}（${b.relationship}）继承${b.share}`).join('\n')}

${executor ? `【执行人】
我指定${executor}作为遗嘱执行人，负责按照本遗嘱处理我的遗产。
` : ''}

【结束语】
以上是我的真实意思表示，本遗嘱自我去世之日起生效。

【见证人声明】
请见证人依次说明：我是（姓名），我见证了${testatorName}在神志清楚的情况下录制此遗嘱，这是他/她的真实意思表示。

三、录制后注意事项
1. 录音/录像文件应完整保存，不得剪辑
2. 建议制作多个备份，分别保管
3. 告知执行人录音/录像文件的保存位置
4. 建议将录音/录像文件刻录成光盘或存储在可靠的云端
`;

  const complianceCheck: ComplianceCheckResult = {
    isValid: true,
    errors: [],
    warnings: [
      '录音录像遗嘱必须有两名以上见证人在场',
      '录音/录像内容必须完整、清晰',
      '必须在录音/录像中说明当前日期和时间',
      '见证人必须在录音/录像中表明身份',
    ],
  };

  const instructions = [
    '录音或录像应当全程不间断',
    '画面或声音必须清晰，能够辨认立遗嘱人和见证人',
    '录像时建议全程拍摄立遗嘱人面部',
    '见证人必须在录音/录像中表明身份并确认见证',
    '录音/录像文件不得编辑、剪辑',
    '建议在律师指导下录制',
  ];

  return {
    content,
    complianceCheck,
    instructions,
  };
};

/**
 * 生成公证遗嘱指引
 */
export const generateNotarizedWillGuidelines = (will: Will): string => {
  return `公证遗嘱办理指引

一、准备材料
1. 本人身份证原件及复印件
2. 户口本原件及复印件
3. 财产证明材料：
   - 房产证或不动产权证
   - 银行存折/卡及近期流水
   - 股票账户证明
   - 车辆行驶证
   - 其他财产证明
4. 受益人身份信息（姓名、身份证号、联系方式）
5. 遗嘱草稿（可提前准备）

二、办理流程
1. 预约公证处：致电当地公证处预约时间
2. 提交申请：携带材料到公证处提交申请
3. 公证员谈话：公证员会单独与您谈话，确认遗嘱内容
4. 审查材料：公证处审查财产证明材料
5. 制作遗嘱：根据您的意愿制作遗嘱文本
6. 签署确认：在公证员面前签署遗嘱
7. 领取公证书：一般3-5个工作日后领取

三、注意事项
1. 本人必须亲自到场，不得委托他人代办
2. 公证员会单独与您谈话，确认是本人真实意思
3. 如有健康问题，需提供医院证明（证明神志清楚）
4. 公证费用一般按遗产价值的一定比例收取
5. 公证遗嘱的法律效力最高
6. 遗嘱可以在公证处保管，也可自行保管

四、公证处联系方式
（请咨询当地公证处获取详细信息）

五、费用说明
- 公证费：一般按遗产价值的0.2%-0.5%收取
- 保管费：如选择公证处保管，需支付年度保管费
- 具体费用以当地公证处标准为准
`;
};

/**
 * 检查自书遗嘱合规性
 */
const checkSelfWrittenWillCompliance = (will: Will): ComplianceCheckResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查基本信息
  if (!will.testatorName || !will.testatorIdNumber) {
    errors.push('立遗嘱人信息不完整（姓名、身份证号必填）');
  }

  // 检查年龄
  if (will.testatorAge < 18) {
    errors.push('立遗嘱人必须年满18周岁');
  }

  // 检查财产清单
  if (!will.estates || will.estates.length === 0) {
    errors.push('遗产清单不能为空');
  }

  // 检查受益人
  if (!will.beneficiaries || will.beneficiaries.length === 0) {
    errors.push('至少需要指定一位受益人');
  }

  // 检查配偶法定份额（警告）
  const hasSpouse = will.beneficiaries.some(b =>
    b.relationship.includes('配偶') || b.relationship.includes('妻') || b.relationship.includes('夫')
  );
  if (!hasSpouse && will.testatorAge < 70) {
    warnings.push('注意：配偶享有法定继承份额，建议在遗嘱中明确说明配偶的继承权');
  }

  // 检查受益人份额
  const totalShares = will.beneficiaries.map(b => b.share).join('、');
  if (totalShares.length > 0) {
    warnings.push('请确保受益人份额总和不超过100%，避免产生纠纷');
  }

  // 检查执行人
  if (!will.executor) {
    warnings.push('建议指定遗嘱执行人，以便顺利执行遗嘱');
  }

  const isValid = errors.length === 0;

  return { isValid, errors, warnings };
};

/**
 * 检查代书遗嘱合规性
 */
const checkWitnessedWillCompliance = (will: Will): ComplianceCheckResult => {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 检查基本合规性
  const baseCheck = checkSelfWrittenWillCompliance(will);
  errors.push(...baseCheck.errors);
  warnings.push(...baseCheck.warnings);

  // 检查见证人
  if (!will.witnesses || will.witnesses.length < 2) {
    errors.push('代书遗嘱必须有两名以上见证人在场见证');
  } else {
    // 检查见证人是否是受益人
    const beneficiaryNames = will.beneficiaries.map(b => b.name);
    const witnessIsbeneficiary = will.witnesses.some(w => beneficiaryNames.includes(w.name));
    if (witnessIsbeneficiary) {
      errors.push('见证人不能是受益人或与受益人有利害关系');
    }
  }

  const isValid = errors.length === 0;

  return { isValid, errors, warnings };
};

/**
 * AI生成遗嘱内容建议
 */
export const generateAISuggestions = (will: Will): string[] => {
  const suggestions: string[] = [];

  // 根据年龄提供建议
  if (will.testatorAge >= 70) {
    suggestions.push('建议您进行遗嘱公证，以增强法律效力并减少日后纠纷');
    suggestions.push('考虑指定专业律师作为遗嘱执行人，确保遗嘱顺利执行');
  }

  // 根据财产类型提供建议
  const hasRealEstate = will.estates.some(e => e.type === 'real_estate');
  if (hasRealEstate) {
    suggestions.push('房产继承需要办理过户手续，建议提前了解相关流程和税费');
  }

  const hasSecurities = will.estates.some(e => e.type === 'securities');
  if (hasSecurities) {
    suggestions.push('股票证券价值波动大，建议定期更新遗嘱中的财产估值');
  }

  // 根据受益人关系提供建议
  const hasMinorBeneficiary = will.beneficiaries.some(b =>
    b.relationship.includes('孙') || b.relationship.includes('外孙')
  );
  if (hasMinorBeneficiary) {
    suggestions.push('如受益人为未成年人，建议指定监护人管理其继承的财产');
  }

  // 特殊条款建议
  if (!will.specialClauses || will.specialClauses.length === 0) {
    suggestions.push('您可以设置特殊条款，如附条件继承、特定物品归属等');
  }

  return suggestions;
};

/**
 * 生成遗嘱PDF（返回HTML格式，可用于PDF转换）
 */
export const generateWillHTML = (will: Will): string => {
  let template: GeneratedWill;

  switch (will.type) {
    case WillType.SELF_WRITTEN:
      template = generateSelfWrittenWillTemplate(will);
      break;
    case WillType.WITNESSED:
      template = generateWitnessedWillTemplate(will);
      break;
    case WillType.AUDIO_VIDEO:
      template = generateAudioVideoWillGuidelines(will);
      break;
    default:
      template = generateSelfWrittenWillTemplate(will);
  }

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>遗嘱文档</title>
  <style>
    body {
      font-family: "SimSun", serif;
      font-size: 14px;
      line-height: 2;
      margin: 40px;
    }
    h1 {
      text-align: center;
      font-size: 24px;
      margin-bottom: 30px;
    }
    .content {
      white-space: pre-wrap;
    }
    .instructions {
      margin-top: 40px;
      padding: 20px;
      background-color: #f5f5f5;
      border-left: 4px solid #1890ff;
    }
    .instructions h2 {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .instructions ol {
      margin-left: 20px;
    }
    .warnings {
      margin-top: 20px;
      padding: 15px;
      background-color: #fffbe6;
      border-left: 4px solid #faad14;
    }
  </style>
</head>
<body>
  <div class="content">${template.content}</div>

  <div class="instructions">
    <h2>填写指引</h2>
    <ol>
      ${template.instructions.map(instruction => `<li>${instruction}</li>`).join('')}
    </ol>
  </div>

  ${template.complianceCheck.warnings.length > 0 ? `
  <div class="warnings">
    <h2>重要提示</h2>
    <ul>
      ${template.complianceCheck.warnings.map(warning => `<li>${warning}</li>`).join('')}
    </ul>
  </div>
  ` : ''}
</body>
</html>
  `;

  return html;
};

export default {
  generateSelfWrittenWillTemplate,
  generateWitnessedWillTemplate,
  generateAudioVideoWillGuidelines,
  generateNotarizedWillGuidelines,
  generateAISuggestions,
  generateWillHTML,
};
