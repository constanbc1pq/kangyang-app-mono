import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Dimensions,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

/**
 * Phase 36.3: 案例库 - Legal Case Library Screen
 *
 * Features:
 * - Real case database
 * - Case search and filtering
 * - Case detail display (case facts, court decision, legal analysis)
 */

// ==================== Type Definitions ====================

type ScreenStep = 'caseList' | 'caseDetail';

interface CaseCategory {
  id: string;
  name: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  caseCount: number;
}

interface LegalCase {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  court: string;
  caseNumber: string;
  judgmentDate: string;
  plaintiff: string;
  defendant: string;
  disputeAmount?: string;
  tags: string[];
  caseFacts: string[];
  plaintiffClaim: string[];
  defendantDefense: string[];
  courtFindings: string[];
  courtDecision: string[];
  legalBasis: string[];
  caseAnalysis: string[];
  practicalTips: string[];
  relatedCases: string[];
}

// ==================== Mock Data ====================

const CASE_CATEGORIES: CaseCategory[] = [
  {
    id: 'inheritance',
    name: '继承纠纷',
    icon: 'people',
    color: '#1890ff',
    caseCount: 28,
  },
  {
    id: 'support',
    name: '赡养纠纷',
    icon: 'heart',
    color: '#eb2f96',
    caseCount: 24,
  },
  {
    id: 'property',
    name: '财产纠纷',
    icon: 'home',
    color: '#722ed1',
    caseCount: 31,
  },
  {
    id: 'fraud',
    name: '养老诈骗',
    icon: 'warning',
    color: '#ff4d4f',
    caseCount: 19,
  },
  {
    id: 'guardianship',
    name: '监护纠纷',
    icon: 'shield',
    color: '#52c41a',
    caseCount: 15,
  },
  {
    id: 'contract',
    name: '合同纠纷',
    icon: 'document-text',
    color: '#13c2c2',
    caseCount: 22,
  },
];

const LEGAL_CASES: LegalCase[] = [
  // Inheritance Cases
  {
    id: 'case_inherit_001',
    categoryId: 'inheritance',
    title: '代书遗嘱因见证人不适格被判无效案',
    summary: '王老太订立代书遗嘱将房产留给小儿子，但两名见证人中一人是小儿子的配偶，法院判定遗嘱无效。',
    court: '北京市朝阳区人民法院',
    caseNumber: '(2023)京0105民初12345号',
    judgmentDate: '2023-06-15',
    plaintiff: '王某甲（长子）、王某乙（次子）',
    defendant: '王某丙（小儿子）',
    disputeAmount: '房产价值约300万元',
    tags: ['代书遗嘱', '见证人资格', '遗嘱无效'],
    caseFacts: [
      '王老太生前育有三子：长子王某甲、次子王某乙、小儿子王某丙。',
      '2022年5月，王老太身体欠佳，口述遗嘱由邻居张某代书，将名下一套房产留给小儿子王某丙。',
      '见证人为邻居张某和王某丙的妻子李某。',
      '遗嘱上有王老太签名和手印，注明日期为2022年5月10日。',
      '2022年10月，王老太去世。王某丙凭遗嘱要求继承房产。',
      '长子王某甲和次子王某乙认为遗嘱无效，要求按法定继承分配遗产。',
    ],
    plaintiffClaim: [
      '王老太所立代书遗嘱无效，理由是见证人李某是王某丙的妻子，属于与继承人有利害关系的人，不具备见证人资格。',
      '应按照法定继承，三个儿子平均分配房产。',
    ],
    defendantDefense: [
      '代书遗嘱有两名见证人在场，符合法律形式要求。',
      '王老太生前多次表示要将房产留给小儿子，遗嘱体现了其真实意愿。',
      '母亲生病期间主要由小儿子照顾，理应多分遗产。',
    ],
    courtFindings: [
      '根据《民法典》第1140条，下列人员不能作为遗嘱见证人：继承人、受遗赠人以及与继承人、受遗赠人有利害关系的人。',
      '见证人李某作为王某丙的配偶，属于与继承人有利害关系的人，不具备遗嘱见证人资格。',
      '代书遗嘱应当有两个以上见证人在场见证，本案中只有张某一人为合格见证人，不满足法定要求。',
      '因此，该代书遗嘱不符合法定形式要件，应认定为无效。',
    ],
    courtDecision: [
      '确认王老太于2022年5月10日所立代书遗嘱无效。',
      '王老太名下房产按法定继承处理，由王某甲、王某乙、王某丙各继承三分之一。',
      '案件受理费由王某丙承担。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第1127条（法定继承）',
      '《中华人民共和国民法典》第1135条（代书遗嘱的形式要件）',
      '《中华人民共和国民法典》第1140条（遗嘱见证人的资格）',
    ],
    caseAnalysis: [
      '本案的关键争议点在于代书遗嘱见证人的资格问题。',
      '《民法典》明确规定，与继承人、受遗赠人有利害关系的人不能作为遗嘱见证人。这里的"利害关系人"包括继承人的配偶、子女、父母等近亲属。',
      '本案中，李某作为王某丙的配偶，与王某丙有直接的利害关系。如果遗嘱有效，王某丙将独自继承房产，李某作为配偶将共同享有该房产，因此李某不具备见证人资格。',
      '虽然代书遗嘱有两名见证人签名，但只有一名是合格的，不满足"两个以上见证人"的法定要求，因此遗嘱无效。',
    ],
    practicalTips: [
      '订立代书遗嘱时，务必选择与继承人、受遗赠人无利害关系的人担任见证人。',
      '最好选择律师、基层法律工作者、居委会工作人员等第三方担任见证人。',
      '见证人应当是完全民事行为能力人，且最好身体健康、年龄适中，以便日后能够作证。',
      '如条件允许，建议将遗嘱进行公证，公证遗嘱虽然不再具有优先效力，但证明力最强。',
      '或者采用自书遗嘱的形式，由立遗嘱人亲笔书写、签名并注明日期，无需见证人。',
    ],
    relatedCases: ['case_inherit_002', 'case_inherit_003'],
  },
  {
    id: 'case_inherit_002',
    categoryId: 'inheritance',
    title: '打印遗嘱未在每页签名被认定无效案',
    summary: '李老伯订立打印遗嘱，但只在最后一页签名，未在每一页签名，法院判定遗嘱无效。',
    court: '上海市浦东新区人民法院',
    caseNumber: '(2023)沪0115民初23456号',
    judgmentDate: '2023-08-20',
    plaintiff: '李某A（女儿）',
    defendant: '李某B（儿子）',
    disputeAmount: '房产价值约500万元',
    tags: ['打印遗嘱', '签名要求', '遗嘱无效'],
    caseFacts: [
      '李老伯有一子一女，名下有一套房产。',
      '2022年12月，李老伯用电脑打印了一份遗嘱，将房产留给儿子李某B。',
      '遗嘱共3页，李老伯只在第3页末尾签名并注明日期。',
      '见证人张某和王某在第3页签名。',
      '2023年3月，李老伯去世。',
      '女儿李某A认为遗嘱无效，起诉要求按法定继承分配遗产。',
    ],
    plaintiffClaim: [
      '打印遗嘱只在最后一页签名，不符合《民法典》规定的"遗嘱人和见证人应当在遗嘱每一页签名"的要求。',
      '遗嘱应认定为无效，按法定继承处理。',
    ],
    defendantDefense: [
      '遗嘱有父亲签名和见证人签名，体现了父亲的真实意愿。',
      '虽未在每页签名，但不影响遗嘱的真实性。',
    ],
    courtFindings: [
      '根据《民法典》第1136条，打印遗嘱应当有两个以上见证人在场见证。遗嘱人和见证人应当在遗嘱每一页签名，注明年、月、日。',
      '本案中，打印遗嘱共3页，但李老伯和见证人仅在第3页签名，未在第1页和第2页签名。',
      '该打印遗嘱不符合法定形式要件，应认定为无效。',
    ],
    courtDecision: [
      '确认李老伯于2022年12月所立打印遗嘱无效。',
      '李老伯名下房产按法定继承，由李某A和李某B各继承二分之一。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第1127条（法定继承）',
      '《中华人民共和国民法典》第1136条（打印遗嘱的形式要件）',
    ],
    caseAnalysis: [
      '打印遗嘱是《民法典》新增的遗嘱形式，适应了现代社会的需要。',
      '但打印遗嘱有严格的形式要求，其中最关键的就是"在每一页签名"。',
      '要求在每一页签名的目的是防止遗嘱被篡改。如果只在最后一页签名，前面的页面可能被替换或添加内容。',
      '本案中，虽然遗嘱在最后一页有签名，但因未在每一页签名，不符合法定形式，遗嘱无效。',
    ],
    practicalTips: [
      '订立打印遗嘱时，务必在每一页签名，不能只在最后一页签名。',
      '建议在打印前保存电子版文件，作为证据。',
      '遗嘱人和两名见证人都应在每一页签名。',
      '如果遗嘱内容较多，可以考虑使用公证遗嘱，避免形式瑕疵。',
      '或者采用自书遗嘱，由立遗嘱人全部亲笔书写，更为稳妥。',
    ],
    relatedCases: ['case_inherit_001', 'case_inherit_003'],
  },
  {
    id: 'case_inherit_003',
    categoryId: 'inheritance',
    title: '遗产债务清偿后继承人分割剩余遗产案',
    summary: '赵老伯去世后留有房产和债务，法院判决先清偿债务，剩余遗产由继承人分割。',
    court: '广州市天河区人民法院',
    caseNumber: '(2023)粤0106民初34567号',
    judgmentDate: '2023-09-10',
    plaintiff: '赵某A、赵某B（子女）',
    defendant: '债权人张某',
    disputeAmount: '房产价值300万元，债务80万元',
    tags: ['遗产债务', '清偿顺序', '遗产分割'],
    caseFacts: [
      '赵老伯生前有一套房产，价值约300万元。',
      '赵老伯生前向张某借款80万元，用于治疗疾病。',
      '2023年2月，赵老伯去世，未留遗嘱。',
      '继承人为两个子女赵某A和赵某B。',
      '债权人张某要求用遗产清偿债务。',
      '赵某A和赵某B认为应先分割遗产，各自承担一半债务。',
    ],
    plaintiffClaim: [
      '父亲去世后，遗产应由两名子女平均继承。',
      '债务应由两人各承担一半，即每人承担40万元。',
      '房产分割后，各自用自己继承的份额偿还债务。',
    ],
    defendantDefense: [
      '根据法律规定，继承遗产应当清偿被继承人的债务。',
      '应当先用遗产清偿债务，剩余部分才能由继承人分割。',
      '赵老伯欠款80万元有借条和转账记录为证。',
    ],
    courtFindings: [
      '根据《民法典》第1159条，分割遗产，应当清偿被继承人依法应当缴纳的税款和债务。',
      '《民法典》第1161条规定，继承人以所得遗产实际价值为限清偿被继承人依法应当缴纳的税款和债务。',
      '本案中，赵老伯对张某负有80万元债务，有借条和银行转账记录为证，债务真实。',
      '应当先用遗产清偿债务，剩余部分由继承人赵某A和赵某B平均继承。',
    ],
    courtDecision: [
      '赵老伯名下房产用于清偿对张某的债务80万元。',
      '房产价值约300万元，扣除债务80万元后，剩余220万元。',
      '剩余遗产220万元由赵某A和赵某B各继承110万元。',
      '在实际执行中，可以拍卖房产，先偿还债务，剩余款项由继承人分割；或由继承人协商一致后用其他方式处理。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第1127条（法定继承）',
      '《中华人民共和国民法典》第1159条（清偿被继承人债务）',
      '《中华人民共和国民法典》第1161条（限定继承原则）',
    ],
    caseAnalysis: [
      '本案涉及遗产债务的清偿顺序问题。',
      '我国实行限定继承原则，继承人只在继承遗产的实际价值范围内承担债务清偿责任。',
      '分割遗产前，应当先清偿被继承人的债务。不能先分割遗产，再由各继承人承担债务。',
      '如果遗产不足以清偿全部债务，继承人可以不偿还超出部分，但如果继承人自愿偿还，法律不禁止。',
      '本案中，遗产价值300万元，债务80万元，遗产足以清偿。因此应先清偿债务，剩余220万元由两名继承人平均分割。',
    ],
    practicalTips: [
      '继承遗产前，应当清点被继承人的债务，包括借款、欠税、医疗费等。',
      '继承人只在遗产实际价值范围内承担债务，超出部分无须偿还。',
      '如果债务大于遗产，继承人可以选择放弃继承，这样就不用承担任何债务。',
      '在办理继承手续时，应当留意是否有债权人主张权利。',
      '建议在分割遗产前，公告通知可能的债权人，避免日后纠纷。',
    ],
    relatedCases: ['case_inherit_001', 'case_property_002'],
  },

  // Support Cases
  {
    id: 'case_support_001',
    categoryId: 'support',
    title: '子女以"父母有退休金"为由拒付赡养费被判败诉案',
    summary: '张大妈起诉三个子女支付赡养费，子女辩称母亲有退休金，法院判决子女仍需支付赡养费。',
    court: '杭州市西湖区人民法院',
    caseNumber: '(2023)浙0106民初45678号',
    judgmentDate: '2023-07-25',
    plaintiff: '张某（母亲，75岁）',
    defendant: '张某A、张某B、张某C（三个子女）',
    disputeAmount: '每月赡养费共3600元',
    tags: ['赡养义务', '退休金', '赡养费'],
    caseFacts: [
      '张大妈今年75岁，丈夫已故，独自居住。',
      '张大妈每月退休金2500元，患有高血压、糖尿病等慢性病。',
      '三个子女张某A、张某B、张某C已成家立业，经济条件尚可。',
      '张大妈多次要求子女支付赡养费和探望，但子女以母亲有退休金为由拒绝。',
      '张大妈无奈起诉三个子女，要求每人每月支付赡养费1200元。',
    ],
    plaintiffClaim: [
      '虽有退休金2500元，但需支付房租1200元、生活费1000元、医疗费等，入不敷出。',
      '三个子女应当履行赡养义务，要求每人每月支付赡养费1200元。',
      '要求子女定期探望，给予精神慰藉。',
    ],
    defendantDefense: [
      '母亲有退休金2500元，能够满足基本生活需要，无需子女支付赡养费。',
      '子女工作繁忙，经济压力大，无力支付高额赡养费。',
    ],
    courtFindings: [
      '根据《老年人权益保障法》和《民法典》规定，成年子女对父母负有赡养、扶助和保护的义务。',
      '赡养义务是法定义务，不因父母有无退休金、存款等而免除。',
      '张大妈每月退休金2500元，但需支付房租、生活费、医疗费等，确实存在困难。',
      '三个子女均已成年且有收入，应当履行赡养义务。',
      '综合考虑张大妈的实际需要和三个子女的经济能力，判决每人每月支付赡养费800元是合理的。',
    ],
    courtDecision: [
      '张某A、张某B、张某C自判决生效之日起，每人每月向张某支付赡养费800元。',
      '三个子女应当经常探望张某，不得忽视老年人的精神需求。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第1067条（父母子女相互扶养义务）',
      '《中华人民共和国老年人权益保障法》第14条（赡养义务）',
    ],
    caseAnalysis: [
      '本案的核心问题是：父母有退休金，子女是否还需支付赡养费？',
      '答案是肯定的。赡养义务是法定义务，不因父母的经济状况而免除。',
      '即使父母有退休金、存款，子女仍有赡养义务，包括经济供养、生活照料和精神慰藉。',
      '赡养费的数额应综合考虑老年人的实际需要、当地生活水平和子女的经济能力。',
      '本案中，法院综合考量后判决每人每月支付800元，既保障了老人的生活，也考虑了子女的负担。',
    ],
    practicalTips: [
      '子女的赡养义务是法定的，不能以父母有退休金为由拒绝。',
      '赡养不仅包括给钱，还包括生活照料和精神慰藉。',
      '老年人如果子女不履行赡养义务，可以通过居委会、村委会调解，或直接向法院起诉。',
      '老年人起诉子女支付赡养费，法院不收取诉讼费。',
      '建议子女主动履行赡养义务，避免对簿公堂，伤害亲情。',
    ],
    relatedCases: ['case_support_002', 'case_support_003'],
  },
  {
    id: 'case_support_002',
    categoryId: 'support',
    title: '多子女赡养责任分配案：尽主要照料义务的子女可多分遗产',
    summary: '刘老伯去世后，长子因多年照顾父亲，法院判决其可多分遗产，其他子女少分。',
    court: '成都市武侯区人民法院',
    caseNumber: '(2023)川0107民初56789号',
    judgmentDate: '2023-10-05',
    plaintiff: '刘某A（长子）',
    defendant: '刘某B、刘某C、刘某D（次子、三子、女儿）',
    disputeAmount: '房产价值约400万元',
    tags: ['遗产分割', '赡养义务', '多分遗产'],
    caseFacts: [
      '刘老伯有四个子女：长子刘某A、次子刘某B、三子刘某C、女儿刘某D。',
      '刘老伯晚年体弱多病，长子刘某A辞职在家照顾父亲长达5年。',
      '其他三个子女很少探望，也未支付赡养费。',
      '刘老伯去世后未留遗嘱，名下有一套房产价值约400万元。',
      '长子刘某A要求多分遗产，其他子女要求平均分配。',
    ],
    plaintiffClaim: [
      '原告照顾父亲多年，尽了主要赡养义务，应当多分遗产。',
      '其他子女很少探望，未尽赡养义务，应当少分或不分。',
      '要求原告分得遗产的50%，其他三人各分16.67%。',
    ],
    defendantDefense: [
      '法定继承应当平均分配，四个子女各分25%。',
      '被告虽未亲自照料，但有各自的困难，不应少分遗产。',
    ],
    courtFindings: [
      '根据《民法典》第1130条，同一顺序继承人继承遗产的份额，一般应当均等。',
      '对被继承人尽了主要扶养义务或者与被继承人共同生活的继承人，分配遗产时，可以多分。',
      '有扶养能力和有扶养条件的继承人，不尽扶养义务的，分配遗产时，应当不分或者少分。',
      '本案中，刘某A辞职在家照顾父亲5年，尽了主要赡养义务，应当多分遗产。',
      '刘某B、刘某C、刘某D虽有各自困难，但很少探望父亲，未支付赡养费，未尽赡养义务，应当少分遗产。',
    ],
    courtDecision: [
      '刘老伯名下房产由四名子女继承，其中：',
      '刘某A继承50%（200万元）',
      '刘某B、刘某C、刘某D各继承16.67%（约66.7万元）',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第1127条（法定继承顺序）',
      '《中华人民共和国民法典》第1130条（继承份额的确定）',
    ],
    caseAnalysis: [
      '本案体现了法律对尽赡养义务者的保护。',
      '虽然法定继承一般应当均等，但法律也规定了可以多分或少分的情形。',
      '尽主要赡养义务的子女可以多分，不尽赡养义务的子女应当少分，这体现了权利义务对等的原则。',
      '本案中，长子照顾父亲5年，其他子女很少探望，差距明显，法院判决长子多分是合理的。',
    ],
    practicalTips: [
      '子女应当积极履行赡养义务，这不仅是法律要求，也是道德责任。',
      '尽主要赡养义务的子女，在分割遗产时可以多分。',
      '不尽赡养义务的子女，可能会少分甚至不分遗产。',
      '老年人如果希望照顾自己的子女多分遗产，可以立遗嘱明确。',
      '多个子女应当协商分担赡养责任，避免将负担全部压在一人身上。',
    ],
    relatedCases: ['case_support_001', 'case_inherit_003'],
  },

  // Property Cases
  {
    id: 'case_property_001',
    categoryId: 'property',
    title: '老人房产证加名后被子女强制卖房案',
    summary: '陈老太将房产加上儿子名字后，儿子欠债，房产被强制执行拍卖，陈老太无家可归。',
    court: '深圳市福田区人民法院',
    caseNumber: '(2023)粤0304民初67890号',
    judgmentDate: '2023-11-12',
    plaintiff: '陈某（母亲）',
    defendant: '陈某A（儿子）、债权人某银行',
    disputeAmount: '房产价值约350万元',
    tags: ['房产加名', '强制执行', '居住权'],
    caseFacts: [
      '陈老太名下有一套房产，是其唯一住房。',
      '2020年，儿子陈某A要求在房产证上加名，称方便日后继承。',
      '陈老太同意，将房产变更为共有，陈老太和陈某A各占50%。',
      '2021年，陈某A做生意失败，欠银行贷款200万元。',
      '2022年，银行向法院申请强制执行，要求拍卖房产抵债。',
      '2023年，法院裁定拍卖房产，陈老太提出异议。',
    ],
    plaintiffClaim: [
      '房产是原告唯一住房，不应被强制执行。',
      '原告已75岁，无其他住处，拍卖房产将导致原告无家可归。',
      '要求法院中止对房产的执行。',
    ],
    defendantDefense: [
      '（陈某A）房产是共有财产，法院有权执行我的份额。',
      '（银行）陈某A欠款200万元，有权执行其名下财产。房产共有，可以执行陈某A的50%份额。',
    ],
    courtFindings: [
      '根据法律规定，被执行人名下的财产可以被强制执行以清偿债务。',
      '本案房产为陈某和陈某A共有，各占50%。法院可以执行陈某A的50%份额。',
      '执行方式可以是拍卖整个房产，陈某分得50%款项；或由陈某购买陈某A的50%份额。',
      '如果陈某无力购买，且房产被拍卖，陈某有权分得50%拍卖款，但确实面临无房居住的困境。',
      '本案中，陈某将房产加上儿子名字，导致房产成为共有财产，法律上确实可以执行。',
    ],
    courtDecision: [
      '准许银行对陈某A在房产中的50%份额进行执行。',
      '执行方式：先询问陈某是否愿意按评估价购买陈某A的50%份额；如不购买，拍卖整个房产，陈某分得50%款项。',
      '鉴于陈某的实际困难，给予6个月宽限期寻找住房。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第297条（共有财产的处分）',
      '《中华人民共和国民事诉讼法》（强制执行）',
    ],
    caseAnalysis: [
      '本案是典型的房产加名引发的悲剧。',
      '老人将房产加上子女名字，法律上视为赠与，子女取得了部分产权。',
      '一旦子女欠债，其名下的产权份额可以被强制执行。',
      '即使是老人的唯一住房，法院也可以执行子女的份额，导致房产被拍卖。',
      '本案提醒老年人：不要轻易在房产证上加名，一旦加名，将面临巨大风险。',
    ],
    practicalTips: [
      '不要轻易在房产证上加子女名字，这等于将产权赠与子女。',
      '加名后，子女欠债、离婚等都可能导致房产被分割或执行。',
      '如果希望子女继承房产，应通过订立遗嘱的方式，而非加名。',
      '如果一定要加名，可以同时为自己设立居住权，写入房产证，这样即使房产被卖，也有权继续居住。',
      '已经加名且面临风险的，应尽快咨询律师，寻求解决方案。',
    ],
    relatedCases: ['case_property_002', 'case_fraud_001'],
  },

  // Fraud Cases
  {
    id: 'case_fraud_001',
    categoryId: 'fraud',
    title: '养老理财诈骗案：老人投资"养老基地"被骗300万',
    summary: '王某等人以投资养老基地为名，承诺年回报18%，非法吸收老年人存款超5000万元，最终案发。',
    court: '北京市第二中级人民法院',
    caseNumber: '(2023)京02刑初00123号',
    judgmentDate: '2023-12-01',
    plaintiff: '北京市人民检察院第二分院',
    defendant: '王某、李某、张某（诈骗团伙）',
    tags: ['养老诈骗', '非法集资', '刑事案件'],
    caseFacts: [
      '2018年起，王某等人成立"某某养老投资公司"，宣称投资养老基地项目。',
      '承诺投资年回报率18%，保本保息，到期全额返还本金。',
      '通过免费旅游、免费体检、赠送礼品等方式吸引老年人参加推介会。',
      '雇佣"托儿"冒充投资者现身说法，营造投资氛围。',
      '以"国家养老工程""政府支持项目"为幌子，增加可信度。',
      '2018年至2022年间，共吸收老年人资金超5000万元。',
      '前期按时返息，吸引更多投资；后期资金链断裂，停止返息。',
      '2022年底，大量老人报案，公安机关立案侦查。',
      '查明所谓"养老基地"子虚乌有，资金主要用于返息、挥霍和转移。',
    ],
    plaintiffClaim: [
      '被告人王某、李某、张某以非法占有为目的，虚构养老基地投资项目，骗取老年人钱财，数额特别巨大，应以诈骗罪追究刑事责任。',
    ],
    defendantDefense: [
      '我们确实计划建设养老基地，只是因为经营不善导致资金链断裂，不是诈骗。',
    ],
    courtFindings: [
      '被告人王某、李某、张某以非法占有为目的，虚构投资项目，骗取他人财物，数额特别巨大，其行为构成诈骗罪。',
      '所谓"养老基地"从未真实存在，被告人从未实际开展养老项目，所吸收资金主要用于支付前期投资人的高额利息、个人挥霍和转移。',
      '被告人采用承诺高额回报、虚假宣传、赠送礼品等手段，专门针对老年人实施诈骗，社会影响恶劣。',
      '被告人在案发后，态度较差，未退赃，应从严惩处。',
    ],
    courtDecision: [
      '被告人王某犯诈骗罪，判处有期徒刑十五年，并处罚金人民币一百万元。',
      '被告人李某犯诈骗罪，判处有期徒刑十二年，并处罚金人民币五十万元。',
      '被告人张某犯诈骗罪，判处有期徒刑十年，并处罚金人民币三十万元。',
      '责令三名被告人退赔被害人损失。',
    ],
    legalBasis: [
      '《中华人民共和国刑法》第266条（诈骗罪）',
      '《关于办理养老诈骗刑事案件适用法律若干问题的意见》',
    ],
    caseAnalysis: [
      '本案是典型的养老投资诈骗案件，具有以下特点：',
      '1. 针对老年人：利用老年人对养老的关注，虚构养老项目。',
      '2. 承诺高息：年回报率18%远超银行利率，明显不合理。',
      '3. 虚假宣传：以"国家工程""政府支持"为幌子，增加可信度。',
      '4. 小恩小惠：通过免费旅游、体检、赠品吸引老人参与。',
      '5. 前期返息：用后来者的钱支付前期投资人的利息，是典型的"庞氏骗局"。',
      '6. 没有实际项目：所谓养老基地从未存在，纯属虚构。',
    ],
    practicalTips: [
      '警惕高息诱惑：正规理财产品收益率一般在3-6%，超过10%的要高度警惕。',
      '核实公司资质：查询公司是否在工商部门登记，是否有金融许可证。',
      '"国家项目"多为骗局：国家从未推出高息养老投资项目。',
      '不贪小便宜：免费旅游、免费体检往往是诈骗的第一步。',
      '与家人商量：投资前务必与子女商量，不要被"限时优惠"冲昏头脑。',
      '受骗后立即报案：不要因为面子问题隐瞒，及时报案有助于挽回损失。',
    ],
    relatedCases: ['case_fraud_002', 'case_fraud_003'],
  },

  // Guardianship Cases
  {
    id: 'case_guardianship_001',
    categoryId: 'guardianship',
    title: '意定监护协议效力认定案',
    summary: '周老伯订立意定监护协议指定侄子为监护人，后患老年痴呆，子女要求担任监护人被驳回。',
    court: '苏州市姑苏区人民法院',
    caseNumber: '(2023)苏0508民初78901号',
    judgmentDate: '2023-09-28',
    plaintiff: '周某A、周某B（子女）',
    defendant: '周某C（侄子）',
    tags: ['意定监护', '监护协议', '法定监护'],
    caseFacts: [
      '周老伯有两个子女周某A和周某B，但与子女关系疏远。',
      '2020年，周老伯头脑清醒时，与侄子周某C签订意定监护协议，指定周某C为其监护人，并进行了公证。',
      '协议约定：如周老伯丧失或部分丧失民事行为能力，由周某C担任监护人，负责生活照料、医疗决策、财产管理等。',
      '2023年初，周老伯被诊断为老年痴呆，丧失民事行为能力。',
      '周某C依照意定监护协议，开始履行监护职责。',
      '两个子女周某A和周某B认为自己才是法定监护人，要求撤销意定监护协议，由他们担任监护人。',
    ],
    plaintiffClaim: [
      '根据法律规定，子女是父母的第一顺序法定监护人。',
      '意定监护协议虽经公证，但侵害了子女的监护权。',
      '要求撤销意定监护协议，由两名子女担任监护人。',
    ],
    defendantDefense: [
      '意定监护协议是周老伯在头脑清醒时自主签订，经过公证，合法有效。',
      '《民法典》明确规定，意定监护优先于法定监护。',
      '周老伯生前与子女关系疏远，子女很少探望，而被告与周老伯关系亲密，更适合担任监护人。',
    ],
    courtFindings: [
      '根据《民法典》第33条，具有完全民事行为能力的成年人，可以与其近亲属、其他愿意担任监护人的个人或者组织事先协商，以书面形式确定自己的监护人。',
      '意定监护优先于法定监护。',
      '本案中，周老伯于2020年在完全民事行为能力时，与周某C签订意定监护协议，并经公证，符合法律规定，合法有效。',
      '周老伯有权自主选择监护人，该选择应当得到尊重。',
      '周某A和周某B虽为法定第一顺序监护人，但因存在意定监护协议，不能自动成为监护人。',
    ],
    courtDecision: [
      '驳回周某A、周某B的诉讼请求。',
      '确认周某C与周老伯签订的意定监护协议有效，周某C为周老伯的监护人。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第33条（意定监护）',
    ],
    caseAnalysis: [
      '本案是意定监护制度的典型案例。',
      '《民法典》确立了意定监护优先于法定监护的原则。',
      '成年人可以在意识清醒时，提前指定信任的人担任自己失能后的监护人。',
      '意定监护协议一旦依法成立，就优先于法定监护顺序，法定监护人不能主张监护权。',
      '本案中，虽然子女是第一顺序法定监护人，但因存在有效的意定监护协议，子女不能担任监护人。',
      '这体现了对个人自主意愿的尊重，也有助于避免子女争夺监护权的纠纷。',
    ],
    practicalTips: [
      '意定监护是为自己养老提前做好规划的重要方式。',
      '在头脑清醒时，可以选择信任的人担任失能后的监护人。',
      '意定监护协议应当以书面形式订立，最好进行公证。',
      '意定监护优先于法定监护，法定监护人不能自动取代意定监护人。',
      '建议与遗嘱结合使用，全面规划养老和身后事宜。',
    ],
    relatedCases: ['case_guardianship_002', 'case_support_001'],
  },

  // Contract Cases
  {
    id: 'case_contract_001',
    categoryId: 'contract',
    title: '养老院单方涨价引发退费纠纷案',
    summary: '养老院在合同中未约定费用调整机制，入住一年后单方涨价50%，老人要求退费并赔偿。',
    court: '武汉市武昌区人民法院',
    caseNumber: '(2023)鄂0106民初89012号',
    judgmentDate: '2023-10-18',
    plaintiff: '刘某（老人）',
    defendant: '某某养老院',
    disputeAmount: '退还预付费18万元，赔偿损失3万元',
    tags: ['养老院合同', '单方涨价', '退费纠纷'],
    caseFacts: [
      '2022年5月，刘某与某某养老院签订入住合同，约定床位费3000元/月，护理费2000元/月，餐费1000元/月，共计6000元/月。',
      '合同期限3年，刘某一次性预付了3年费用共21.6万元（享受优惠后）。',
      '合同中未约定费用调整的条件和幅度。',
      '2023年5月，入住一年后，养老院通知刘某：自2023年6月起，床位费调整为4500元/月，护理费调整为3000元/月，共计8500元/月，涨幅约42%。',
      '刘某认为涨价不合理，要求按原价继续履行合同，否则退还剩余预付费并赔偿损失。',
      '养老院拒绝，称因成本上涨必须调价，如不接受可以退住，但不退还预付费。',
    ],
    plaintiffClaim: [
      '养老院单方涨价违反合同约定，构成违约。',
      '合同中未约定涨价条款，养老院无权单方调整价格。',
      '要求养老院按原价格继续履行合同；如养老院拒绝，退还剩余2年预付费18万元，并赔偿重新寻找养老院的损失3万元。',
    ],
    defendantDefense: [
      '因人工、物价上涨，养老院成本增加，必须调整价格才能维持运营。',
      '其他入住老人都接受了涨价，只有原告不接受。',
      '合同虽未约定涨价条款，但根据公平原则，养老院有权调价。',
      '如原告不接受，可以退住，但已收取的预付费不予退还，因合同约定"一经缴纳，不予退还"。',
    ],
    courtFindings: [
      '养老院服务合同是双方真实意思表示，合法有效。',
      '合同中明确约定了收费标准，但未约定费用调整的条件、幅度和程序。',
      '养老院单方大幅调整价格（涨幅约42%），未与刘某协商，构成违约。',
      '合同中"一经缴纳，不予退还"的条款系格式条款，排除了消费者解除合同、要求退费的权利，属于无效条款。',
      '刘某有权要求退还剩余预付费。',
      '刘某因养老院违约需重新寻找养老院，确实产生了损失，养老院应当赔偿。',
    ],
    courtDecision: [
      '养老院应当退还刘某剩余2年预付费18万元。',
      '养老院应当赔偿刘某重新寻找养老院的交通费、评估费等合理损失2万元。',
      '驳回刘某其他诉讼请求。',
    ],
    legalBasis: [
      '《中华人民共和国民法典》第509条（合同履行）',
      '《中华人民共和国民法典》第497条（格式条款的效力）',
      '《中华人民共和国消费者权益保护法》',
    ],
    caseAnalysis: [
      '本案是典型的养老院合同纠纷。',
      '养老院单方涨价是常见问题，但如果合同中未约定涨价条款，养老院无权单方调价。',
      '即使因成本上涨确有困难，也应与老人协商，不能强制涨价。',
      '合同中"一经缴纳，不予退还"的条款，属于格式条款，排除了消费者权利，应认定为无效。',
      '老人如遇养老院单方涨价，可以拒绝，并要求按原价继续履行；如养老院拒绝，可以要求退费并赔偿损失。',
    ],
    practicalTips: [
      '签订养老院合同时，务必审查费用调整条款，约定涨价的条件、幅度、程序。',
      '建议约定"年度涨幅不超过5%""涨价需提前3个月通知"等限制性条款。',
      '预付费期限不宜过长，建议不超过1年，避免风险。',
      '对"不予退还"等排除己方权利的条款，要求删除或修改。',
      '遇到单方涨价，不要轻易接受，应据理力争或寻求法律帮助。',
    ],
    relatedCases: ['case_contract_002', 'case_fraud_004'],
  },
];

// ==================== Helper Functions ====================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

// ==================== Main Component ====================

const CaseLibraryScreen: React.FC<any> = ({ navigation }) => {
  const [currentStep, setCurrentStep] = useState<ScreenStep>('caseList');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [caseList, setCaseList] = useState<LegalCase[]>(LEGAL_CASES);

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // ==================== Search and Filter ====================

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      // Reset to all cases or filtered by category
      if (selectedCategory) {
        const filtered = LEGAL_CASES.filter(c => c.categoryId === selectedCategory);
        setCaseList(filtered);
      } else {
        setCaseList(LEGAL_CASES);
      }
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    // Search in title, summary, tags
    const results = LEGAL_CASES.filter(legalCase => {
      const lowerQuery = query.toLowerCase();
      return (
        legalCase.title.toLowerCase().includes(lowerQuery) ||
        legalCase.summary.toLowerCase().includes(lowerQuery) ||
        legalCase.tags.some(tag => tag.toLowerCase().includes(lowerQuery)) ||
        legalCase.court.toLowerCase().includes(lowerQuery)
      );
    });

    setCaseList(results);
  };

  const handleCategoryFilter = (categoryId: string | null) => {
    setSelectedCategory(categoryId);
    setSearchQuery('');
    setIsSearching(false);

    if (categoryId === null) {
      setCaseList(LEGAL_CASES);
    } else {
      const filtered = LEGAL_CASES.filter(c => c.categoryId === categoryId);
      setCaseList(filtered);
    }
  };

  // ==================== Navigation ====================

  const handleCasePress = (legalCase: LegalCase) => {
    setSelectedCase(legalCase);
    setCurrentStep('caseDetail');
  };

  const handleBackPress = () => {
    if (currentStep === 'caseDetail') {
      setCurrentStep('caseList');
      setSelectedCase(null);
    } else {
      navigation.goBack();
    }
  };

  // ==================== Render Methods ====================

  const renderCategoryChip = (category: CaseCategory) => {
    const isSelected = selectedCategory === category.id;

    return (
      <TouchableOpacity
        key={category.id}
        style={[
          styles.categoryChip,
          isSelected && { backgroundColor: category.color, borderColor: category.color },
        ]}
        onPress={() => handleCategoryFilter(isSelected ? null : category.id)}
      >
        <Ionicons
          name={category.icon}
          size={16}
          color={isSelected ? '#fff' : category.color}
        />
        <Text
          style={[
            styles.categoryChipText,
            isSelected && { color: '#fff' },
            !isSelected && { color: category.color },
          ]}
        >
          {category.name}
        </Text>
      </TouchableOpacity>
    );
  };

  const renderCaseCard = (legalCase: LegalCase) => {
    const category = CASE_CATEGORIES.find(c => c.id === legalCase.categoryId);

    return (
      <TouchableOpacity
        key={legalCase.id}
        style={styles.caseCard}
        onPress={() => handleCasePress(legalCase)}
      >
        <View style={styles.caseHeader}>
          {category && (
            <View style={[styles.caseCategoryBadge, { backgroundColor: category.color + '20' }]}>
              <Ionicons name={category.icon} size={14} color={category.color} />
              <Text style={[styles.caseCategoryText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
          )}
        </View>
        <Text style={styles.caseTitle}>{legalCase.title}</Text>
        <Text style={styles.caseSummary} numberOfLines={3}>{legalCase.summary}</Text>
        <View style={styles.caseTags}>
          {legalCase.tags.slice(0, 3).map((tag, index) => (
            <View key={index} style={styles.caseTag}>
              <Text style={styles.caseTagText}>{tag}</Text>
            </View>
          ))}
        </View>
        <View style={styles.caseMeta}>
          <View style={styles.caseMetaItem}>
            <Ionicons name="business" size={14} color="#999" />
            <Text style={styles.caseMetaText}> {legalCase.court}</Text>
          </View>
          <View style={styles.caseMetaItem}>
            <Ionicons name="calendar" size={14} color="#999" />
            <Text style={styles.caseMetaText}> {formatDate(legalCase.judgmentDate)}</Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderListSection = (title: string, items: string[]) => {
    if (items.length === 0) return null;

    return (
      <View style={styles.detailSection}>
        <Text style={styles.detailSectionTitle}>{title}</Text>
        {items.map((item, index) => (
          <View key={index} style={styles.detailListItem}>
            <Text style={styles.detailListBullet}>• </Text>
            <Text style={styles.detailListText}>{item}</Text>
          </View>
        ))}
      </View>
    );
  };

  // ==================== Screen Views ====================

  const renderCaseListView = () => (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#333" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>法律案例库</Text>
        <View style={styles.headerRight} />
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={20} color="#999" style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="搜索案例、法院、关键词..."
          value={searchQuery}
          onChangeText={handleSearch}
          placeholderTextColor="#999"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => handleSearch('')} style={styles.searchClearButton}>
            <Ionicons name="close-circle" size={20} color="#999" />
          </TouchableOpacity>
        )}
      </View>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.categoryContainer}
        contentContainerStyle={styles.categoryContent}
      >
        <TouchableOpacity
          style={[
            styles.categoryChip,
            selectedCategory === null && { backgroundColor: '#1890ff', borderColor: '#1890ff' },
          ]}
          onPress={() => handleCategoryFilter(null)}
        >
          <Text
            style={[
              styles.categoryChipText,
              selectedCategory === null && { color: '#fff' },
            ]}
          >
            全部
          </Text>
        </TouchableOpacity>
        {CASE_CATEGORIES.map(category => renderCategoryChip(category))}
      </ScrollView>

      {/* Case List */}
      <FlatList
        data={caseList}
        renderItem={({ item }) => renderCaseCard(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.caseListContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="folder-open-outline" size={64} color="#ccc" />
            <Text style={styles.emptyStateText}>暂无相关案例</Text>
            <Text style={styles.emptyStateHint}>试试其他关键词吧</Text>
          </View>
        }
      />
    </View>
  );

  const renderCaseDetailView = () => {
    if (!selectedCase) return null;

    const category = CASE_CATEGORIES.find(c => c.id === selectedCase.categoryId);

    return (
      <View style={styles.container}>
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
            <Ionicons name="arrow-back" size={24} color="#333" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>案例详情</Text>
          <View style={styles.headerRight} />
        </View>

        <ScrollView style={styles.caseDetail} showsVerticalScrollIndicator={false}>
          {/* Title and Category */}
          {category && (
            <View style={[styles.detailCategoryBadge, { backgroundColor: category.color + '20' }]}>
              <Ionicons name={category.icon} size={18} color={category.color} />
              <Text style={[styles.detailCategoryText, { color: category.color }]}>
                {category.name}
              </Text>
            </View>
          )}
          <Text style={styles.detailTitle}>{selectedCase.title}</Text>
          <Text style={styles.detailSummary}>{selectedCase.summary}</Text>

          {/* Tags */}
          <View style={styles.detailTags}>
            {selectedCase.tags.map((tag, index) => (
              <View key={index} style={styles.detailTag}>
                <Text style={styles.detailTagText}>{tag}</Text>
              </View>
            ))}
          </View>

          {/* Case Info */}
          <View style={styles.caseInfoBox}>
            <View style={styles.caseInfoRow}>
              <Text style={styles.caseInfoLabel}>审理法院：</Text>
              <Text style={styles.caseInfoValue}>{selectedCase.court}</Text>
            </View>
            <View style={styles.caseInfoRow}>
              <Text style={styles.caseInfoLabel}>案号：</Text>
              <Text style={styles.caseInfoValue}>{selectedCase.caseNumber}</Text>
            </View>
            <View style={styles.caseInfoRow}>
              <Text style={styles.caseInfoLabel}>判决日期：</Text>
              <Text style={styles.caseInfoValue}>{formatDate(selectedCase.judgmentDate)}</Text>
            </View>
            <View style={styles.caseInfoRow}>
              <Text style={styles.caseInfoLabel}>原告：</Text>
              <Text style={styles.caseInfoValue}>{selectedCase.plaintiff}</Text>
            </View>
            <View style={styles.caseInfoRow}>
              <Text style={styles.caseInfoLabel}>被告：</Text>
              <Text style={styles.caseInfoValue}>{selectedCase.defendant}</Text>
            </View>
            {selectedCase.disputeAmount && (
              <View style={styles.caseInfoRow}>
                <Text style={styles.caseInfoLabel}>争议标的：</Text>
                <Text style={styles.caseInfoValue}>{selectedCase.disputeAmount}</Text>
              </View>
            )}
          </View>

          {/* Case Sections */}
          {renderListSection('案件事实', selectedCase.caseFacts)}
          {renderListSection('原告诉称', selectedCase.plaintiffClaim)}
          {renderListSection('被告辩称', selectedCase.defendantDefense)}
          {renderListSection('法院查明', selectedCase.courtFindings)}
          {renderListSection('法院判决', selectedCase.courtDecision)}
          {renderListSection('法律依据', selectedCase.legalBasis)}
          {renderListSection('案例分析', selectedCase.caseAnalysis)}
          {renderListSection('实务提示', selectedCase.practicalTips)}

          {/* Related Cases */}
          {selectedCase.relatedCases.length > 0 && (
            <View style={styles.relatedSection}>
              <Text style={styles.detailSectionTitle}>相关案例</Text>
              {selectedCase.relatedCases.map(relatedId => {
                const relatedCase = LEGAL_CASES.find(c => c.id === relatedId);
                return relatedCase ? renderCaseCard(relatedCase) : null;
              })}
            </View>
          )}

          <View style={{ height: 30 }} />
        </ScrollView>
      </View>
    );
  };

  // ==================== Main Render ====================

  if (currentStep === 'caseList') {
    return renderCaseListView();
  } else if (currentStep === 'caseDetail') {
    return renderCaseDetailView();
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

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e8e8e8',
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 40,
    fontSize: 15,
    color: '#333',
  },
  searchClearButton: {
    padding: 4,
  },

  // Category Chips
  categoryContainer: {
    backgroundColor: '#fff',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  categoryContent: {
    paddingHorizontal: 16,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e8e8e8',
    marginRight: 8,
    backgroundColor: '#fff',
  },
  categoryChipText: {
    fontSize: 13,
    marginLeft: 4,
    color: '#666',
    fontWeight: '500',
  },

  // Case List
  caseListContent: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 30,
  },

  // Case Card
  caseCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  caseHeader: {
    marginBottom: 8,
  },
  caseCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  caseCategoryText: {
    fontSize: 12,
    marginLeft: 4,
    fontWeight: '500',
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
    lineHeight: 24,
  },
  caseSummary: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 12,
  },
  caseTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  caseTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 4,
  },
  caseTagText: {
    fontSize: 12,
    color: '#666',
  },
  caseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  caseMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 16,
    marginTop: 4,
  },
  caseMetaText: {
    fontSize: 12,
    color: '#999',
  },

  // Case Detail
  caseDetail: {
    flex: 1,
    backgroundColor: '#fff',
  },
  detailCategoryBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    marginHorizontal: 16,
    marginTop: 20,
  },
  detailCategoryText: {
    fontSize: 14,
    marginLeft: 6,
    fontWeight: '600',
  },
  detailTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    lineHeight: 30,
    paddingHorizontal: 16,
    marginTop: 12,
    marginBottom: 12,
  },
  detailSummary: {
    fontSize: 15,
    color: '#666',
    lineHeight: 24,
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  detailTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  detailTag: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 4,
    marginRight: 8,
    marginBottom: 8,
  },
  detailTagText: {
    fontSize: 13,
    color: '#666',
  },

  // Case Info Box
  caseInfoBox: {
    backgroundColor: '#f9f9f9',
    marginHorizontal: 16,
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  caseInfoRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  caseInfoLabel: {
    fontSize: 14,
    color: '#999',
    width: 80,
  },
  caseInfoValue: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },

  // Detail Sections
  detailSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  detailSectionTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  detailListItem: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailListBullet: {
    fontSize: 15,
    color: '#1890ff',
    marginRight: 8,
    fontWeight: 'bold',
  },
  detailListText: {
    flex: 1,
    fontSize: 15,
    color: '#333',
    lineHeight: 24,
  },

  // Related Section
  relatedSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    paddingVertical: 80,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#999',
    marginTop: 16,
  },
  emptyStateHint: {
    fontSize: 14,
    color: '#ccc',
    marginTop: 8,
  },
});

export default CaseLibraryScreen;
