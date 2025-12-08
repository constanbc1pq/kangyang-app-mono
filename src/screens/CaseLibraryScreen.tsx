import React, { useState } from 'react';
import { Pressable, FlatList, StatusBar } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, Input, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  XCircle,
  Building,
  Calendar,
  FolderOpen,
  Users,
  Heart,
  Home,
  AlertTriangle,
  Shield,
  FileText,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

/**
 * Phase 36.3: 案例库 - Legal Case Library Screen
 *
 * Features:
 * - Real case database
 * - Case search and filtering
 * - Case detail display (case facts, court decision, legal analysis)
 */

const GOLD_COLOR = '#D4AF37';

// ==================== Type Definitions ====================

type ScreenStep = 'caseList' | 'caseDetail';

interface CaseCategory {
  id: string;
  name: string;
  icon: string;
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

// ==================== Helper Functions ====================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

// ==================== Icon Component ====================

const CategoryIcon: React.FC<{ icon: string; color: string; size: number }> = ({ icon, color, size }) => {
  const icons: Record<string, React.ReactNode> = {
    'people': <Users size={size} color={color} />,
    'heart': <Heart size={size} color={color} />,
    'home': <Home size={size} color={color} />,
    'warning': <AlertTriangle size={size} color={color} />,
    'shield': <Shield size={size} color={color} />,
    'document-text': <FileText size={size} color={color} />,
  };
  return <>{icons[icon] || <FileText size={size} color={color} />}</>;
};

// ==================== Main Component ====================

const CaseLibraryScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const errorColor = theme.error?.val;
  const color9 = theme.color9?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState<ScreenStep>('caseList');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCase, setSelectedCase] = useState<LegalCase | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Mock Data with theme colors
  const CASE_CATEGORIES: CaseCategory[] = [
    { id: 'inheritance', name: '继承纠纷', icon: 'people', color: primaryColor || '#6366F1', caseCount: 28 },
    { id: 'support', name: '赡养纠纷', icon: 'heart', color: GOLD_COLOR, caseCount: 24 },
    { id: 'property', name: '财产纠纷', icon: 'home', color: primaryColor || '#6366F1', caseCount: 31 },
    { id: 'fraud', name: '养老诈骗', icon: 'warning', color: errorColor || '#EF4444', caseCount: 19 },
    { id: 'guardianship', name: '监护纠纷', icon: 'shield', color: successColor || '#10B981', caseCount: 15 },
    { id: 'contract', name: '合同纠纷', icon: 'document-text', color: primaryColor || '#6366F1', caseCount: 22 },
  ];

  const LEGAL_CASES: LegalCase[] = [
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
      ],
      plaintiffClaim: [
        '王老太所立代书遗嘱无效，理由是见证人李某是王某丙的妻子，属于与继承人有利害关系的人，不具备见证人资格。',
        '应按照法定继承，三个儿子平均分配房产。',
      ],
      defendantDefense: [
        '代书遗嘱有两名见证人在场，符合法律形式要求。',
        '王老太生前多次表示要将房产留给小儿子，遗嘱体现了其真实意愿。',
      ],
      courtFindings: [
        '根据《民法典》第1140条，下列人员不能作为遗嘱见证人：继承人、受遗赠人以及与继承人、受遗赠人有利害关系的人。',
        '见证人李某作为王某丙的配偶，属于与继承人有利害关系的人，不具备遗嘱见证人资格。',
        '代书遗嘱应当有两个以上见证人在场见证，本案中只有张某一人为合格见证人，不满足法定要求。',
      ],
      courtDecision: [
        '确认王老太于2022年5月10日所立代书遗嘱无效。',
        '王老太名下房产按法定继承处理，由王某甲、王某乙、王某丙各继承三分之一。',
      ],
      legalBasis: [
        '《中华人民共和国民法典》第1127条（法定继承）',
        '《中华人民共和国民法典》第1135条（代书遗嘱的形式要件）',
        '《中华人民共和国民法典》第1140条（遗嘱见证人的资格）',
      ],
      caseAnalysis: [
        '本案的关键争议点在于代书遗嘱见证人的资格问题。',
        '《民法典》明确规定，与继承人、受遗赠人有利害关系的人不能作为遗嘱见证人。',
        '本案中，李某作为王某丙的配偶，与王某丙有直接的利害关系，不具备见证人资格。',
      ],
      practicalTips: [
        '订立代书遗嘱时，务必选择与继承人、受遗赠人无利害关系的人担任见证人。',
        '最好选择律师、基层法律工作者、居委会工作人员等第三方担任见证人。',
        '如条件允许，建议将遗嘱进行公证。',
      ],
      relatedCases: ['case_inherit_002'],
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
        '2023年3月，李老伯去世。',
      ],
      plaintiffClaim: [
        '打印遗嘱只在最后一页签名，不符合《民法典》规定的"遗嘱人和见证人应当在遗嘱每一页签名"的要求。',
      ],
      defendantDefense: [
        '遗嘱有父亲签名和见证人签名，体现了父亲的真实意愿。',
      ],
      courtFindings: [
        '根据《民法典》第1136条，打印遗嘱应当有两个以上见证人在场见证。遗嘱人和见证人应当在遗嘱每一页签名，注明年、月、日。',
        '本案中，打印遗嘱共3页，但李老伯和见证人仅在第3页签名。',
      ],
      courtDecision: [
        '确认李老伯于2022年12月所立打印遗嘱无效。',
        '李老伯名下房产按法定继承，由李某A和李某B各继承二分之一。',
      ],
      legalBasis: [
        '《中华人民共和国民法典》第1136条（打印遗嘱的形式要件）',
      ],
      caseAnalysis: [
        '打印遗嘱是《民法典》新增的遗嘱形式，但有严格的形式要求。',
        '要求在每一页签名的目的是防止遗嘱被篡改。',
      ],
      practicalTips: [
        '订立打印遗嘱时，务必在每一页签名，不能只在最后一页签名。',
        '遗嘱人和两名见证人都应在每一页签名。',
      ],
      relatedCases: ['case_inherit_001'],
    },
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
      ],
      plaintiffClaim: [
        '虽有退休金2500元，但需支付房租1200元、生活费1000元、医疗费等，入不敷出。',
        '三个子女应当履行赡养义务，要求每人每月支付赡养费1200元。',
      ],
      defendantDefense: [
        '母亲有退休金2500元，能够满足基本生活需要，无需子女支付赡养费。',
      ],
      courtFindings: [
        '根据《老年人权益保障法》和《民法典》规定，成年子女对父母负有赡养、扶助和保护的义务。',
        '赡养义务是法定义务，不因父母有无退休金、存款等而免除。',
        '三个子女均已成年且有收入，应当履行赡养义务。',
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
      ],
      practicalTips: [
        '子女的赡养义务是法定的，不能以父母有退休金为由拒绝。',
        '老年人如果子女不履行赡养义务，可以通过居委会调解或直接向法院起诉。',
        '老年人起诉子女支付赡养费，法院不收取诉讼费。',
      ],
      relatedCases: ['case_support_002'],
    },
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
      ],
      plaintiffClaim: [
        '房产是原告唯一住房，不应被强制执行。',
        '原告已75岁，无其他住处，拍卖房产将导致原告无家可归。',
      ],
      defendantDefense: [
        '房产是共有财产，法院有权执行陈某A的份额。',
      ],
      courtFindings: [
        '根据法律规定，被执行人名下的财产可以被强制执行以清偿债务。',
        '本案房产为陈某和陈某A共有，各占50%。法院可以执行陈某A的50%份额。',
      ],
      courtDecision: [
        '准许银行对陈某A在房产中的50%份额进行执行。',
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
      ],
      practicalTips: [
        '不要轻易在房产证上加子女名字。',
        '如果希望子女继承房产，应通过订立遗嘱的方式，而非加名。',
        '如果一定要加名，可以同时为自己设立居住权，写入房产证。',
      ],
      relatedCases: ['case_fraud_001'],
    },
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
        '2018年至2022年间，共吸收老年人资金超5000万元。',
        '查明所谓"养老基地"子虚乌有，资金主要用于返息、挥霍和转移。',
      ],
      plaintiffClaim: [
        '被告人王某、李某、张某以非法占有为目的，虚构养老基地投资项目，骗取老年人钱财，应以诈骗罪追究刑事责任。',
      ],
      defendantDefense: [
        '我们确实计划建设养老基地，只是因为经营不善导致资金链断裂，不是诈骗。',
      ],
      courtFindings: [
        '被告人王某、李某、张某以非法占有为目的，虚构投资项目，骗取他人财物，数额特别巨大，其行为构成诈骗罪。',
        '所谓"养老基地"从未真实存在，被告人从未实际开展养老项目。',
      ],
      courtDecision: [
        '被告人王某犯诈骗罪，判处有期徒刑十五年，并处罚金人民币一百万元。',
        '被告人李某犯诈骗罪，判处有期徒刑十二年，并处罚金人民币五十万元。',
        '被告人张某犯诈骗罪，判处有期徒刑十年，并处罚金人民币三十万元。',
      ],
      legalBasis: [
        '《中华人民共和国刑法》第266条（诈骗罪）',
      ],
      caseAnalysis: [
        '本案是典型的养老投资诈骗案件，具有针对老年人、承诺高息、虚假宣传等特点。',
        '前期返息，用后来者的钱支付前期投资人的利息，是典型的"庞氏骗局"。',
      ],
      practicalTips: [
        '警惕高息诱惑：正规理财产品收益率一般在3-6%，超过10%的要高度警惕。',
        '核实公司资质：查询公司是否在工商部门登记，是否有金融许可证。',
        '与家人商量：投资前务必与子女商量，不要被"限时优惠"冲昏头脑。',
      ],
      relatedCases: ['case_property_001'],
    },
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
        '2023年初，周老伯被诊断为老年痴呆，丧失民事行为能力。',
        '两个子女认为自己才是法定监护人，要求撤销意定监护协议。',
      ],
      plaintiffClaim: [
        '根据法律规定，子女是父母的第一顺序法定监护人。',
        '要求撤销意定监护协议，由两名子女担任监护人。',
      ],
      defendantDefense: [
        '意定监护协议是周老伯在头脑清醒时自主签订，经过公证，合法有效。',
        '《民法典》明确规定，意定监护优先于法定监护。',
      ],
      courtFindings: [
        '根据《民法典》第33条，具有完全民事行为能力的成年人，可以与其近亲属、其他愿意担任监护人的个人或者组织事先协商，以书面形式确定自己的监护人。',
        '意定监护优先于法定监护。',
        '本案中，周老伯于2020年在完全民事行为能力时，与周某C签订意定监护协议，并经公证，符合法律规定。',
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
      ],
      practicalTips: [
        '意定监护是为自己养老提前做好规划的重要方式。',
        '意定监护协议应当以书面形式订立，最好进行公证。',
        '建议与遗嘱结合使用，全面规划养老和身后事宜。',
      ],
      relatedCases: ['case_support_001'],
    },
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
        '2022年5月，刘某与某某养老院签订入住合同，约定床位费3000元/月。',
        '合同期限3年，刘某一次性预付了3年费用共21.6万元。',
        '合同中未约定费用调整的条件和幅度。',
        '2023年5月，养老院通知涨价约42%，刘某认为不合理要求退费。',
      ],
      plaintiffClaim: [
        '养老院单方涨价违反合同约定，构成违约。',
        '要求退还剩余2年预付费18万元，并赔偿重新寻找养老院的损失3万元。',
      ],
      defendantDefense: [
        '因人工、物价上涨，养老院成本增加，必须调整价格。',
        '合同约定"一经缴纳，不予退还"。',
      ],
      courtFindings: [
        '养老院单方大幅调整价格（涨幅约42%），未与刘某协商，构成违约。',
        '合同中"一经缴纳，不予退还"的条款系格式条款，排除了消费者权利，属于无效条款。',
      ],
      courtDecision: [
        '养老院应当退还刘某剩余2年预付费18万元。',
        '养老院应当赔偿刘某重新寻找养老院的合理损失2万元。',
      ],
      legalBasis: [
        '《中华人民共和国民法典》第509条（合同履行）',
        '《中华人民共和国民法典》第497条（格式条款的效力）',
        '《中华人民共和国消费者权益保护法》',
      ],
      caseAnalysis: [
        '本案是典型的养老院合同纠纷。',
        '养老院单方涨价是常见问题，但如果合同中未约定涨价条款，养老院无权单方调价。',
      ],
      practicalTips: [
        '签订养老院合同时，务必审查费用调整条款，约定涨价的条件、幅度、程序。',
        '预付费期限不宜过长，建议不超过1年。',
        '对"不予退还"等排除己方权利的条款，要求删除或修改。',
      ],
      relatedCases: ['case_fraud_001'],
    },
  ];

  const [caseList, setCaseList] = useState<LegalCase[]>(LEGAL_CASES);

  // ==================== Search and Filter ====================

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
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
      <Pressable key={category.id} onPress={() => handleCategoryFilter(isSelected ? null : category.id)}>
        <XStack
          alignItems="center"
          paddingHorizontal="$2"
          paddingVertical="$1"
          borderRadius="$10"
          borderWidth={1}
          marginRight="$1.5"
          borderColor={isSelected ? category.color : '$color5'}
          backgroundColor={isSelected ? category.color : '$color2'}
        >
          <CategoryIcon icon={category.icon} color={isSelected ? 'white' : category.color} size={16} />
          <Text
            fontSize="$2"
            fontWeight="500"
            marginLeft="$1"
            color={isSelected ? 'white' : category.color}
          >
            {category.name}
          </Text>
        </XStack>
      </Pressable>
    );
  };

  const renderCaseCard = (legalCase: LegalCase) => {
    const category = CASE_CATEGORIES.find(c => c.id === legalCase.categoryId);

    return (
      <Pressable key={legalCase.id} onPress={() => handleCasePress(legalCase)}>
        <View backgroundColor="$color2" borderRadius="$4" padding="$2.5" marginBottom="$2" borderWidth={1} borderColor="$color5">
          {category && (
            <View
              alignSelf="flex-start"
              paddingHorizontal="$1.5"
              paddingVertical="$0.5"
              borderRadius="$2"
              marginBottom="$1.5"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <XStack alignItems="center">
                <CategoryIcon icon={category.icon} color={category.color} size={14} />
                <Text fontSize={12} fontWeight="500" marginLeft="$1" style={{ color: category.color }}>
                  {category.name}
                </Text>
              </XStack>
            </View>
          )}
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1.5" lineHeight={24}>
            {legalCase.title}
          </Text>
          <Text fontSize="$3" color="$color10" lineHeight={22} marginBottom="$2" numberOfLines={3}>
            {legalCase.summary}
          </Text>
          <XStack flexWrap="wrap" marginBottom="$2" gap="$1.5">
            {legalCase.tags.slice(0, 3).map((tag, index) => (
              <View key={index} backgroundColor="$color4" paddingHorizontal="$1.5" paddingVertical="$0.5" borderRadius="$2">
                <Text fontSize="$2" color="$color10">{tag}</Text>
              </View>
            ))}
          </XStack>
          <XStack alignItems="center" flexWrap="wrap" gap="$2.5">
            <XStack alignItems="center">
              <Building size={14} color={color9} />
              <Text fontSize="$2" color="$color9" marginLeft="$0.5">{legalCase.court}</Text>
            </XStack>
            <XStack alignItems="center">
              <Calendar size={14} color={color9} />
              <Text fontSize="$2" color="$color9" marginLeft="$0.5">{formatDate(legalCase.judgmentDate)}</Text>
            </XStack>
          </XStack>
        </View>
      </Pressable>
    );
  };

  const renderListSection = (title: string, items: string[]) => {
    if (items.length === 0) return null;

    return (
      <YStack paddingHorizontal="$2.5" marginBottom="$4">
        <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">{title}</Text>
        {items.map((item, index) => (
          <XStack key={index} marginBottom="$2">
            <Text fontSize="$3" fontWeight="bold" marginRight="$1.5" color="$primary">•</Text>
            <Text flex={1} fontSize="$3" color="$color12" lineHeight={24}>{item}</Text>
          </XStack>
        ))}
      </YStack>
    );
  };

  // ==================== Screen Views ====================

  const renderCaseListView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TitleBar title="法律案例库" onBack={handleBackPress} />

      {/* Search Bar */}
      <XStack
        backgroundColor="$color2"
        marginHorizontal="$2.5"
        marginVertical="$2"
        paddingHorizontal="$2"
        borderRadius="$3"
        borderWidth={1}
        borderColor="$color5"
        alignItems="center"
      >
        <Search size={20} color={color9} />
        <Input
          flex={1}
          height={40}
          fontSize="$3"
          color="$color12"
          placeholder="搜索案例、法院、关键词..."
          placeholderTextColor={color9}
          value={searchQuery}
          onChangeText={handleSearch}
          borderWidth={0}
          backgroundColor="transparent"
        />
        {searchQuery.length > 0 && (
          <Pressable onPress={() => handleSearch('')}>
            <XCircle size={20} color={color9} />
          </Pressable>
        )}
      </XStack>

      {/* Category Chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={{ backgroundColor: theme.color2?.val }}
        contentContainerStyle={{ paddingHorizontal: 14, paddingVertical: 12 }}
      >
        <Pressable onPress={() => handleCategoryFilter(null)}>
          <XStack
            alignItems="center"
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$10"
            borderWidth={1}
            marginRight="$1.5"
            borderColor={selectedCategory === null ? primaryColor : '$color5'}
            backgroundColor={selectedCategory === null ? primaryColor : '$color2'}
          >
            <Text
              fontSize="$2"
              fontWeight="500"
              color={selectedCategory === null ? 'white' : '$color10'}
            >
              全部
            </Text>
          </XStack>
        </Pressable>
        {CASE_CATEGORIES.map(category => renderCategoryChip(category))}
      </ScrollView>

      {/* Case List */}
      <FlatList
        data={caseList}
        renderItem={({ item }) => renderCaseCard(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 12, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <YStack alignItems="center" paddingVertical="$8">
            <FolderOpen size={64} color={color9} />
            <Text fontSize="$4" color="$color9" marginTop="$2">暂无相关案例</Text>
            <Text fontSize="$3" color="$color9" marginTop="$1">试试其他关键词吧</Text>
          </YStack>
        }
      />
    </View>
  );

  const renderCaseDetailView = () => {
    if (!selectedCase) return null;

    const category = CASE_CATEGORIES.find(c => c.id === selectedCase.categoryId);

    return (
      <View flex={1} backgroundColor="$background">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <TitleBar title="案例详情" onBack={handleBackPress} />

        <ScrollView flex={1} backgroundColor="$color2" showsVerticalScrollIndicator={false}>
          {/* Title and Category */}
          {category && (
            <View
              alignSelf="flex-start"
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
              marginHorizontal="$2.5"
              marginTop="$4"
              style={{ backgroundColor: `${category.color}20` }}
            >
              <XStack alignItems="center">
                <CategoryIcon icon={category.icon} color={category.color} size={18} />
                <Text fontSize="$3" fontWeight="600" marginLeft="$1" style={{ color: category.color }}>
                  {category.name}
                </Text>
              </XStack>
            </View>
          )}
          <Text
            fontSize="$6"
            fontWeight="600"
            color="$color12"
            lineHeight={30}
            paddingHorizontal="$2.5"
            marginTop="$2"
            marginBottom="$2"
          >
            {selectedCase.title}
          </Text>
          <Text fontSize="$3" color="$color10" lineHeight={24} paddingHorizontal="$2.5" marginBottom="$2.5">
            {selectedCase.summary}
          </Text>

          {/* Tags */}
          <XStack flexWrap="wrap" paddingHorizontal="$2.5" marginBottom="$2.5" gap="$1.5">
            {selectedCase.tags.map((tag, index) => (
              <View key={index} backgroundColor="$color4" paddingHorizontal="$2" paddingVertical="$1" borderRadius="$2">
                <Text fontSize="$2" color="$color10">{tag}</Text>
              </View>
            ))}
          </XStack>

          {/* Case Info */}
          <View backgroundColor="$color4" marginHorizontal="$2.5" padding="$2" borderRadius="$3" marginBottom="$4">
            <XStack marginBottom="$1.5">
              <Text fontSize="$3" color="$color9" width={80}>审理法院：</Text>
              <Text flex={1} fontSize="$3" color="$color12">{selectedCase.court}</Text>
            </XStack>
            <XStack marginBottom="$1.5">
              <Text fontSize="$3" color="$color9" width={80}>案号：</Text>
              <Text flex={1} fontSize="$3" color="$color12">{selectedCase.caseNumber}</Text>
            </XStack>
            <XStack marginBottom="$1.5">
              <Text fontSize="$3" color="$color9" width={80}>判决日期：</Text>
              <Text flex={1} fontSize="$3" color="$color12">{formatDate(selectedCase.judgmentDate)}</Text>
            </XStack>
            <XStack marginBottom="$1.5">
              <Text fontSize="$3" color="$color9" width={80}>原告：</Text>
              <Text flex={1} fontSize="$3" color="$color12">{selectedCase.plaintiff}</Text>
            </XStack>
            <XStack marginBottom="$1.5">
              <Text fontSize="$3" color="$color9" width={80}>被告：</Text>
              <Text flex={1} fontSize="$3" color="$color12">{selectedCase.defendant}</Text>
            </XStack>
            {selectedCase.disputeAmount && (
              <XStack>
                <Text fontSize="$3" color="$color9" width={80}>争议标的：</Text>
                <Text flex={1} fontSize="$3" color="$color12">{selectedCase.disputeAmount}</Text>
              </XStack>
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
            <YStack paddingHorizontal="$2.5" paddingTop="$4" borderTopWidth={1} borderTopColor="$color5">
              <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">相关案例</Text>
              {selectedCase.relatedCases.map(relatedId => {
                const relatedCase = LEGAL_CASES.find(c => c.id === relatedId);
                return relatedCase ? renderCaseCard(relatedCase) : null;
              })}
            </YStack>
          )}

          <View height={30} />
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

export default CaseLibraryScreen;
