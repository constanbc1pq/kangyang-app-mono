import React, { useState, useEffect } from 'react';
import { Pressable, Alert, Share, FlatList, StatusBar } from 'react-native';
import { YStack, XStack, Text, View, Input, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Search,
  XCircle,
  Library,
  ChevronRight,
  Bookmark,
  User,
  Clock,
  Eye,
  Calendar,
  Share2,
  Info,
  AlertCircle,
  FolderOpen,
  FileText,
  Heart,
  Home,
  ShieldCheck,
  File,
  Users,
} from 'lucide-react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TitleBar } from '@/components/TitleBar';

/**
 * Phase 36.2: 法律文章库 - Legal Article Library Screen
 *
 * Features:
 * - Article categorization (will/inheritance, support, property disputes, etc.)
 * - Article list and search
 * - Rich text article detail page
 * - Related article recommendations
 * - Article bookmarking and sharing
 */

const GOLD_COLOR = '#D4AF37';

// ==================== Type Definitions ====================

type ScreenStep = 'categories' | 'articleList' | 'articleDetail';

interface ArticleCategory {
  id: string;
  name: string;
  icon: string;
  color: string;
  articleCount: number;
  description: string;
}

interface LegalArticle {
  id: string;
  categoryId: string;
  title: string;
  summary: string;
  author: string;
  publishDate: string;
  readTime: number;
  views: number;
  likes: number;
  tags: string[];
  content: ArticleContent[];
  relatedArticles: string[];
}

interface ArticleContent {
  type: 'heading' | 'paragraph' | 'list' | 'quote' | 'case';
  content: string | string[];
}

interface ArticleBookmark {
  articleId: string;
  bookmarkedAt: string;
}

interface ReadHistory {
  articleId: string;
  readAt: string;
}

// ==================== Helper Functions ====================

const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}年${month}月${day}日`;
};

const formatViews = (views: number): string => {
  if (views >= 10000) {
    return `${(views / 10000).toFixed(1)}万`;
  }
  return views.toString();
};

// ==================== Icon Component ====================

const CategoryIcon: React.FC<{ icon: string; color: string; size: number }> = ({ icon, color, size }) => {
  const icons: Record<string, React.ReactNode> = {
    'document-text': <FileText size={size} color={color} />,
    'heart': <Heart size={size} color={color} />,
    'home': <Home size={size} color={color} />,
    'shield-checkmark': <ShieldCheck size={size} color={color} />,
    'document': <File size={size} color={color} />,
    'people': <Users size={size} color={color} />,
  };
  return <>{icons[icon] || <FileText size={size} color={color} />}</>;
};

// ==================== Main Component ====================

const LegalArticleScreen: React.FC<any> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color9 = theme.color9?.val;
  const color10 = theme.color10?.val;

  const [currentStep, setCurrentStep] = useState<ScreenStep>('categories');
  const [selectedCategory, setSelectedCategory] = useState<ArticleCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<LegalArticle | null>(null);
  const [articleList, setArticleList] = useState<LegalArticle[]>([]);

  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<LegalArticle[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // User data
  const [bookmarks, setBookmarks] = useState<Set<string>>(new Set());
  const [readHistory, setReadHistory] = useState<ReadHistory[]>([]);

  // Mock Data with theme colors
  const ARTICLE_CATEGORIES: ArticleCategory[] = [
    {
      id: 'will_inheritance',
      name: '遗嘱继承',
      icon: 'document-text',
      color: primaryColor || '#6366F1',
      articleCount: 45,
      description: '遗嘱订立、继承规则、遗产分割',
    },
    {
      id: 'support_rights',
      name: '赡养权益',
      icon: 'heart',
      color: GOLD_COLOR,
      articleCount: 32,
      description: '子女赡养义务、赡养费追索',
    },
    {
      id: 'property_disputes',
      name: '财产纠纷',
      icon: 'home',
      color: primaryColor || '#6366F1',
      articleCount: 38,
      description: '房产纠纷、财产分割、债务处理',
    },
    {
      id: 'fraud_prevention',
      name: '防骗指南',
      icon: 'shield-checkmark',
      color: successColor || '#10B981',
      articleCount: 56,
      description: '养老诈骗识别、防范措施',
    },
    {
      id: 'contract_law',
      name: '合同法律',
      icon: 'document',
      color: primaryColor || '#6366F1',
      articleCount: 41,
      description: '合同签订、条款审查、纠纷处理',
    },
    {
      id: 'guardianship',
      name: '监护制度',
      icon: 'people',
      color: GOLD_COLOR,
      articleCount: 28,
      description: '意定监护、法定监护、监护人职责',
    },
  ];

  const LEGAL_ARTICLES: LegalArticle[] = [
    // Will & Inheritance Articles
    {
      id: 'article_will_001',
      categoryId: 'will_inheritance',
      title: '2024年遗嘱新规：这5种遗嘱形式都有效',
      summary: '《民法典》施行后，遗嘱形式有了新变化。本文详解自书遗嘱、代书遗嘱、打印遗嘱、录音录像遗嘱、口头遗嘱和公证遗嘱的具体要求。',
      author: '张明律师',
      publishDate: '2024-01-15',
      readTime: 8,
      views: 15234,
      likes: 1289,
      tags: ['遗嘱形式', '民法典', '法律效力'],
      content: [
        { type: 'heading', content: '一、自书遗嘱的要求' },
        { type: 'paragraph', content: '自书遗嘱是立遗嘱人亲笔书写的遗嘱。根据《民法典》第1134条，自书遗嘱必须由遗嘱人亲笔书写，签名，注明年、月、日。' },
        { type: 'list', content: ['必须由遗嘱人亲笔书写全部内容，不能打印或由他人代写', '必须由遗嘱人本人签名，不能由他人代签', '必须注明年、月、日，缺一不可', '建议按手印，虽非法定要求，但可增强证明力'] },
        { type: 'case', content: '案例：王老伯自书遗嘱，将房产留给小儿子。但遗嘱中只写了"2023年5月"，未写具体日期。法院判定该遗嘱因缺少完整日期而无效。' },
        { type: 'heading', content: '二、代书遗嘱的要求' },
        { type: 'paragraph', content: '代书遗嘱适用于立遗嘱人不便自己书写的情况。根据《民法典》第1135条，代书遗嘱应当有两个以上见证人在场见证。' },
        { type: 'list', content: ['必须有两个以上见证人在场见证', '由其中一人代书', '代书人、其他见证人和遗嘱人必须签名', '注明年、月、日', '见证人不能是继承人、受遗赠人或与其有利害关系的人'] },
        { type: 'heading', content: '三、打印遗嘱的新规定' },
        { type: 'paragraph', content: '打印遗嘱是《民法典》新增的遗嘱形式。这适应了现代社会的需要，但也有严格要求。' },
        { type: 'list', content: ['必须有两个以上见证人在场见证', '遗嘱人和见证人应当在遗嘱每一页签名', '注明年、月、日', '建议在打印前保存电子版，作为证据'] },
        { type: 'quote', content: '注意：打印遗嘱必须在每一页签名，仅在最后一页签名可能导致遗嘱无效。' },
        { type: 'heading', content: '四、录音录像遗嘱' },
        { type: 'paragraph', content: '录音录像遗嘱适用于书写不便但能口述的情况。' },
        { type: 'list', content: ['必须有两个以上见证人在场见证', '遗嘱人和见证人应当在录音录像中记录姓名或肖像', '注明年、月、日', '录音录像应完整保存，不能剪辑'] },
        { type: 'heading', content: '五、口头遗嘱' },
        { type: 'paragraph', content: '口头遗嘱仅在危急情况下适用，且有效期有限。' },
        { type: 'list', content: ['仅在危急情况下可以订立口头遗嘱', '必须有两个以上见证人在场见证', '危急情况解除后，遗嘱人能够以书面或录音录像形式立遗嘱的，所立口头遗嘱无效'] },
        { type: 'quote', content: '重要提示：危急情况解除后3个月内，应尽快订立书面遗嘱，否则口头遗嘱将失效。' },
        { type: 'heading', content: '六、公证遗嘱不再具有优先效力' },
        { type: 'paragraph', content: '《民法典》一大变化是取消了公证遗嘱的优先效力。现在，多份遗嘱以最后一份为准。' },
        { type: 'list', content: ['立有数份遗嘱，内容相抵触的，以最后的遗嘱为准', '公证遗嘱可以被后立的其他形式遗嘱撤销或变更', '但公证遗嘱仍是证明力最强的遗嘱形式'] },
      ],
      relatedArticles: ['article_will_002', 'article_will_003'],
    },
    {
      id: 'article_will_002',
      categoryId: 'will_inheritance',
      title: '遗嘱见证人的资格要求和法律责任',
      summary: '并非所有人都能担任遗嘱见证人。本文详解见证人的资格条件、不能担任见证人的情形及见证人的法律责任。',
      author: '李强律师',
      publishDate: '2024-01-20',
      readTime: 6,
      views: 9876,
      likes: 876,
      tags: ['遗嘱见证', '法律责任', '资格审查'],
      content: [
        { type: 'heading', content: '一、谁不能担任遗嘱见证人' },
        { type: 'paragraph', content: '根据《民法典》第1140条，下列人员不能作为遗嘱见证人：' },
        { type: 'list', content: ['无民事行为能力人、限制民事行为能力人（如未成年人、精神病人）', '继承人、受遗赠人', '与继承人、受遗赠人有利害关系的人（如继承人的配偶、子女、父母等）'] },
        { type: 'case', content: '案例：刘老太代书遗嘱的两个见证人，一个是她的外甥，一个是外甥的妻子。法院认定这两人与可能继承的外甥有利害关系，遗嘱无效。' },
        { type: 'heading', content: '二、理想的遗嘱见证人' },
        { type: 'list', content: ['完全民事行为能力人（年满18周岁且精神正常）', '与遗嘱人及继承人都无利害关系', '最好是律师、公证员、基层法律服务工作者等法律专业人士', '或者是遗嘱人的朋友、同事、邻居等了解情况的第三方'] },
        { type: 'heading', content: '三、见证人的法律责任' },
        { type: 'paragraph', content: '遗嘱见证人承担以下责任：' },
        { type: 'list', content: ['证明遗嘱订立的真实性：见证遗嘱是立遗嘱人的真实意思表示', '证明遗嘱订立的程序：见证订立过程符合法律规定', '必要时出庭作证：继承纠纷时，见证人可能需要出庭说明情况', '保密义务：未经允许不得泄露遗嘱内容'] },
        { type: 'quote', content: '提示：选择见证人时，应选择身体健康、年龄适中的人，避免日后需要作证时见证人已去世或无法作证的情况。' },
      ],
      relatedArticles: ['article_will_001', 'article_will_003'],
    },
    {
      id: 'article_will_003',
      categoryId: 'will_inheritance',
      title: '继承开始后，遗产如何分割？',
      summary: '继承开始后，遗产应如何清点、债务如何清偿、遗产如何分割？本文提供完整的遗产处理流程指南。',
      author: '赵丽律师',
      publishDate: '2024-01-25',
      readTime: 10,
      views: 12345,
      likes: 1089,
      tags: ['遗产分割', '继承程序', '债务清偿'],
      content: [
        { type: 'heading', content: '一、继承开始的时间' },
        { type: 'paragraph', content: '继承从被继承人死亡时开始。死亡包括自然死亡和宣告死亡。' },
        { type: 'heading', content: '二、遗产的范围' },
        { type: 'paragraph', content: '遗产是自然人死亡时遗留的个人合法财产，包括：' },
        { type: 'list', content: ['收入：工资、奖金、经营收入等', '房屋、车辆等不动产和动产', '知识产权中的财产权利', '股权、股票、基金等', '债权（他人欠被继承人的钱）', '其他合法财产'] },
        { type: 'quote', content: '注意：夫妻共同财产，一半属于配偶，一半才是被继承人的遗产。' },
        { type: 'heading', content: '三、遗产处理流程' },
        { type: 'paragraph', content: '（一）清点遗产' },
        { type: 'list', content: ['收集被继承人的财产信息：房产证、存款凭证、股票账户等', '核实债权债务：被继承人的借款、欠款等', '分割夫妻共同财产：确定哪些是遗产'] },
        { type: 'paragraph', content: '（二）清偿债务' },
        { type: 'list', content: ['继承遗产应当清偿被继承人的债务', '清偿债务以遗产的实际价值为限', '超过遗产价值的债务，继承人可以不偿还', '但继承人自愿偿还的不受此限'] },
        { type: 'paragraph', content: '（三）分割遗产' },
        { type: 'list', content: ['有遗嘱的，按照遗嘱继承', '没有遗嘱的，按照法定继承', '继承人协商一致的，可以不按遗嘱或法定继承比例分割', '协商不成的，可以向人民法院起诉'] },
        { type: 'heading', content: '四、法定继承的顺序和份额' },
        { type: 'paragraph', content: '第一顺序继承人：配偶、子女、父母。' },
        { type: 'paragraph', content: '第二顺序继承人：兄弟姐妹、祖父母、外祖父母。' },
        { type: 'paragraph', content: '同一顺序继承人继承遗产的份额，一般应当均等。但有下列情形的可以不均等：' },
        { type: 'list', content: ['对生活有特殊困难又缺乏劳动能力的继承人，分配遗产时，应当予以照顾', '对被继承人尽了主要扶养义务或者与被继承人共同生活的继承人，可以多分', '有扶养能力和有扶养条件的继承人,不尽扶养义务的，应当不分或者少分'] },
        { type: 'case', content: '案例：李老伯有三个子女。大儿子多年照顾老人，二女儿偶尔探望，小儿子常年不见。法院判决大儿子可多分遗产，小儿子少分。' },
      ],
      relatedArticles: ['article_will_001', 'article_will_002'],
    },
    // Support Rights Articles
    {
      id: 'article_support_001',
      categoryId: 'support_rights',
      title: '子女不尽赡养义务，老人如何维权？',
      summary: '详解老年人维护赡养权益的法律途径，包括协商、调解、诉讼等方式，以及赡养费的计算标准。',
      author: '王芳律师',
      publishDate: '2024-01-18',
      readTime: 9,
      views: 18765,
      likes: 1654,
      tags: ['赡养义务', '赡养费', '法律维权'],
      content: [
        { type: 'heading', content: '一、子女赡养义务的法律规定' },
        { type: 'paragraph', content: '根据《民法典》和《老年人权益保障法》，成年子女对父母负有赡养、扶助和保护的义务。' },
        { type: 'list', content: ['赡养义务包括经济供养、生活照料和精神慰藉', '不得以放弃继承权、父母再婚等理由拒绝履行赡养义务', '多个子女应当共同承担赡养义务'] },
        { type: 'heading', content: '二、赡养费的计算标准' },
        { type: 'paragraph', content: '赡养费的数额应根据以下因素综合确定：' },
        { type: 'list', content: ['老年人的实际需要：生活费、医疗费、护理费等', '子女的经济能力：收入、财产状况', '当地的生活水平：城市或农村，消费水平', '老年人的收入：退休金、其他收入'] },
        { type: 'case', content: '案例：张大妈有三个子女，每月退休金2000元，患有慢性病。法院判决三个子女每人每月支付赡养费800元，并分担医疗费用。' },
        { type: 'heading', content: '三、维权途径' },
        { type: 'paragraph', content: '（一）家庭协商' },
        { type: 'list', content: ['召开家庭会议，商议赡养方案', '签订赡养协议，明确各子女的义务', '协议可以公证，增强法律效力'] },
        { type: 'paragraph', content: '（二）居委会、村委会调解' },
        { type: 'list', content: ['请求居委会、村委会调解', '调解达成协议后，各方应遵守', '调解不成的，可以申请人民调解委员会调解'] },
        { type: 'paragraph', content: '（三）向法院起诉' },
        { type: 'list', content: ['准备起诉状和证据材料', '向被告住所地或原告住所地法院起诉', '老年人起诉子女支付赡养费，可以免交诉讼费', '法院判决后，子女不履行的，可以申请强制执行'] },
        { type: 'quote', content: '提示：拒不执行法院判决情节严重的，可能构成拒不执行判决罪，子女可能被追究刑事责任。' },
        { type: 'heading', content: '四、精神赡养的要求' },
        { type: 'paragraph', content: '除了经济赡养，子女还应当关心老年人的精神需求：' },
        { type: 'list', content: ['经常看望或问候老年人', '与老年人分开居住的，应当经常看望或者问候', '单位应当保障子女探亲休假的权利', '不得忽视、冷落老年人'] },
      ],
      relatedArticles: ['article_support_002', 'article_support_003'],
    },
    {
      id: 'article_support_002',
      categoryId: 'support_rights',
      title: '多子女家庭如何分担赡养责任？',
      summary: '多个子女应如何分担赡养父母的责任？轮流赡养、共同出钱、协议分工，哪种方式更合适？',
      author: '郑律师',
      publishDate: '2024-01-22',
      readTime: 7,
      views: 11234,
      likes: 987,
      tags: ['多子女', '赡养协议', '责任分担'],
      content: [
        { type: 'heading', content: '一、赡养责任的法定分担' },
        { type: 'paragraph', content: '根据法律规定，多个子女应当共同承担赡养义务。' },
        { type: 'list', content: ['每个子女都有赡养义务，不能相互推诿', '赡养父母不分男女，儿子和女儿的义务相同', '已婚子女的赡养义务不因婚姻关系而免除', '经济条件较好的子女应当多承担'] },
        { type: 'heading', content: '二、常见的赡养方式' },
        { type: 'paragraph', content: '（一）轮流赡养' },
        { type: 'list', content: ['父母轮流在各子女家居住', '适合父母身体较好、各子女居住距离较近的情况', '应明确轮流的时间、周期', '轮流期间的医疗等特殊费用如何分担'] },
        { type: 'paragraph', content: '（二）共同出资' },
        { type: 'list', content: ['父母单独居住或在养老院', '子女按月支付赡养费', '可以根据各子女的经济能力确定不同的金额', '医疗等大额支出按比例分担'] },
        { type: 'paragraph', content: '（三）协议分工' },
        { type: 'list', content: ['一个子女主要负责照料,其他子女多出钱', '适合父母需要护理、某个子女有时间的情况', '应充分考虑照料子女的付出', '建议签订书面协议'] },
        { type: 'case', content: '案例：李老伯有三个子女。大儿子在父母身边，负责日常照料;二女儿在外地,每月寄赡养费2000元;小儿子经营公司,每月寄3000元并负担医疗费。三人签订协议,家庭和睦。' },
        { type: 'heading', content: '三、赡养协议的签订' },
        { type: 'paragraph', content: '建议多子女家庭签订书面赡养协议,明确各方权利义务:' },
        { type: 'list', content: ['赡养方式:轮流、出资或分工', '赡养费数额及支付方式', '医疗费、护理费的分担', '父母财产的处理', '违约责任'] },
        { type: 'quote', content: '提示:赡养协议可以到公证处公证,也可以请律师见证,增强法律效力。' },
        { type: 'heading', content: '四、父母财产与赡养义务' },
        { type: 'paragraph', content: '常见误区澄清:' },
        { type: 'list', content: ['误区一:"父母有退休金,子女可以不赡养" - 错误!子女仍有赡养义务', '误区二:"谁继承财产谁赡养" - 错误!继承和赡养是两码事', '误区三:"父母偏心,我可以不赡养" - 错误!法定义务不能因此免除', '误区四:"嫁出去的女儿不用赡养" - 错误!女儿和儿子义务相同'] },
      ],
      relatedArticles: ['article_support_001', 'article_support_003'],
    },
    // Property Disputes Articles
    {
      id: 'article_property_001',
      categoryId: 'property_disputes',
      title: '老年人房产加名减名的法律风险',
      summary: '房产证加减子女名字看似简单,实则涉及巨大法律和税务风险。本文详解加名减名的利弊及替代方案。',
      author: '孙律师',
      publishDate: '2024-01-16',
      readTime: 11,
      views: 16789,
      likes: 1456,
      tags: ['房产加名', '税费', '法律风险'],
      content: [
        { type: 'heading', content: '一、房产证加名的法律后果' },
        { type: 'paragraph', content: '房产证加上子女名字,意味着将房产的部分或全部产权赠与子女,产生以下后果:' },
        { type: 'list', content: ['房产部分产权归子女所有,老人不能单独处置', '子女的债权人可以要求执行该房产', '子女离婚时,该房产可能被分割', '老人去世后,该部分产权不属于遗产', '老人与子女关系恶化时,可能面临无家可归'] },
        { type: 'case', content: '案例:王老伯将唯一住房加上儿子名字。后儿子做生意失败欠债,法院查封了该房产。王老伯想卖房养老,却因房产被查封无法出售。' },
        { type: 'heading', content: '二、房产证加名的税费负担' },
        { type: 'paragraph', content: '房产证加名需要缴纳多种税费:' },
        { type: 'list', content: ['契税:按房产价值的一定比例(通常1-3%)', '个人所得税:如房产增值,可能需缴纳20%', '增值税:持有不满2年的,缴纳5.6%', '印花税:按房产价值的0.05%'] },
        { type: 'quote', content: '示例:价值200万的房产加名,可能产生契税2-6万、增值税11万(如适用)等,总计可能超过20万!' },
        { type: 'heading', content: '三、房产证减名的困难' },
        { type: 'paragraph', content: '房产证减去子女名字,需要子女同意,且面临:' },
        { type: 'list', content: ['子女不同意时,老人无法单方面减名', '即使子女同意,仍需再次缴纳税费', '如房产已被查封或抵押,无法减名'] },
        { type: 'heading', content: '四、更好的替代方案' },
        { type: 'paragraph', content: '（一）订立遗嘱' },
        { type: 'list', content: ['老人保留房产所有权', '通过遗嘱指定继承人', '可以随时修改遗嘱', '避免加名的各种风险', '继承时的税费远低于生前赠与'] },
        { type: 'paragraph', content: '（二）设立居住权' },
        { type: 'list', content: ['老人可以为自己设立终身居住权', '即使房产转让给子女,老人仍可居住', '居住权写入房产证,受法律保护', '子女不能赶老人走,也不能卖房'] },
        { type: 'paragraph', content: '（三）意定监护 + 遗嘱' },
        { type: 'list', content: ['签订意定监护协议,指定失能后的监护人', '同时订立遗嘱,指定继承人', '既保障老年生活,又明确财产归属'] },
        { type: 'case', content: '案例:陈老太订立公证遗嘱,将房产留给照顾自己的小女儿。生前保留所有权,自由居住和使用。去世后,小女儿继承只需缴纳少量契税,其他子女无异议。' },
        { type: 'quote', content: '律师建议:除非必要,不建议老年人在房产证上加名。如有特殊需求,应咨询专业律师,制定周全方案。' },
      ],
      relatedArticles: ['article_property_002', 'article_will_001'],
    },
    // Fraud Prevention Articles
    {
      id: 'article_fraud_001',
      categoryId: 'fraud_prevention',
      title: '识破养老理财骗局的10个关键信号',
      summary: '高息诱惑、专家背书、限时优惠...养老理财骗局有哪些惯用套路?本文教您识别10个关键预警信号。',
      author: '刘警官',
      publishDate: '2024-01-12',
      readTime: 12,
      views: 23456,
      likes: 2145,
      tags: ['理财骗局', '高息陷阱', '防骗技巧'],
      content: [
        { type: 'heading', content: '信号一:承诺高额固定回报' },
        { type: 'paragraph', content: '正规理财产品收益率通常在3-6%,如果有人承诺10%、20%甚至更高的固定回报,十有八九是骗局。' },
        { type: 'list', content: ['警惕"保本保息""年化收益20%"等承诺', '记住:收益越高,风险越大', '正规金融机构不会承诺固定高息'] },
        { type: 'case', content: '案例:某公司以"养老基地投资,年回报18%"为诱饵,吸收老人存款超5000万,最终资金链断裂,老人血本无归。' },
        { type: 'heading', content: '信号二:以"国家项目""政府支持"为噱头' },
        { type: 'list', content: ['谎称"国家养老工程""政府扶持项目"', '伪造政府文件、领导合影', '国家从未推出高息养老投资项目'] },
        { type: 'heading', content: '信号三:要求现金交易或转账至个人账户' },
        { type: 'list', content: ['正规金融机构只接受银行转账到公司账户', '要求现金交易或转账到个人账户的,必是骗局', '务必保留转账记录和收据'] },
        { type: 'heading', content: '信号四:利用"专家""权威"背书' },
        { type: 'list', content: ['请所谓"投资专家""经济学家"讲座', '伪造专家身份和证书', '正规金融机构不会通过讲座高压推销'] },
        { type: 'heading', content: '信号五:营造紧迫感,限时优惠' },
        { type: 'list', content: ['"今天不买就涨价""名额有限,先到先得"', '营造焦虑,阻止老人与家人商量', '正规理财产品不会如此急迫'] },
        { type: 'quote', content: '防骗金句:凡是投资,一定要与子女商量,不要被"限时优惠"冲昏头脑!' },
        { type: 'heading', content: '防骗五步法' },
        { type: 'list', content: ['第一步:保持冷静,不要被高息诱惑', '第二步:核实公司资质,查询工商登记', '第三步:与子女商量,听取家人意见', '第四步:到银行或正规金融机构咨询', '第五步:如有疑问,立即报警'] },
        { type: 'quote', content: '记住:天上不会掉馅饼,守住自己的养老钱比什么都重要!' },
      ],
      relatedArticles: ['article_fraud_002', 'article_fraud_003'],
    },
    // Contract Law Articles
    {
      id: 'article_contract_001',
      categoryId: 'contract_law',
      title: '签订养老院合同必看的8个要点',
      summary: '入住养老院是重大决定,签合同更需谨慎。本文详解养老院合同的8个必审条款,避免踩坑。',
      author: '陈律师',
      publishDate: '2024-01-14',
      readTime: 10,
      views: 15678,
      likes: 1345,
      tags: ['养老院合同', '服务标准', '退费条款'],
      content: [
        { type: 'heading', content: '要点一:明确服务内容和标准' },
        { type: 'paragraph', content: '合同应详细列明养老院提供的服务:' },
        { type: 'list', content: ['居住:房间类型、面积、配套设施', '餐饮:每日几餐、菜品标准、特殊饮食', '护理:护理等级、护理内容、护理频次', '医疗:是否配备医护人员、应急处理', '文娱:是否有活动室、图书室等'] },
        { type: 'quote', content: '提示:服务标准务必写清楚,避免"提供优质服务"等模糊表述。' },
        { type: 'heading', content: '要点二:收费标准和调整机制' },
        { type: 'list', content: ['床位费、护理费、餐费等明细', '是否包含水电、暖气、网络等', '费用调整的条件和幅度限制', '调整费用需提前多久通知'] },
        { type: 'case', content: '案例:李大爷入住时床位费3000元/月,合同未约定调价限制。一年后养老院涨到5000元/月,李大爷无奈只能接受或搬离。' },
        { type: 'heading', content: '要点三:押金和预付费条款' },
        { type: 'list', content: ['押金数额及用途', '押金退还的条件和时限', '预付费的期限(建议不超过1年)', '预付费的退费规则'] },
        { type: 'heading', content: '要点四:退住和退费条款' },
        { type: 'paragraph', content: '这是最重要但最容易忽视的条款:' },
        { type: 'list', content: ['老人去世后,剩余费用如何退还', '老人或家属提出退住,费用如何结算', '养老院违约时,退费和赔偿标准', '退费时限(建议不超过30天)'] },
        { type: 'heading', content: '签约注意事项' },
        { type: 'list', content: ['签约前实地考察,体验几天', '与在住老人及家属交流', '仔细阅读合同,不明白的当场问清', '不合理的条款要求修改', '保留合同原件及所有附件'] },
        { type: 'quote', content: '建议:签订养老院合同前,最好请律师审查,或使用本APP的"合同审查"功能!' },
      ],
      relatedArticles: ['article_contract_002', 'article_fraud_004'],
    },
    // Guardianship Articles
    {
      id: 'article_guardianship_001',
      categoryId: 'guardianship',
      title: '意定监护:为自己选定可信赖的监护人',
      summary: '失能后谁来照顾你、替你做决定?意定监护制度让你提前选定信任的人。本文详解意定监护的办理流程。',
      author: '吴律师',
      publishDate: '2024-01-19',
      readTime: 9,
      views: 10123,
      likes: 898,
      tags: ['意定监护', '公证办理', '监护协议'],
      content: [
        { type: 'heading', content: '一、什么是意定监护' },
        { type: 'paragraph', content: '意定监护是指具有完全民事行为能力的成年人,在自己意识清醒时,与自己信任的人协商,指定其在自己丧失或部分丧失民事行为能力时担任监护人。' },
        { type: 'list', content: ['自主选择:由本人选定监护人,而非法律指定', '提前规划:在头脑清醒时做好安排', '优先效力:意定监护优先于法定监护'] },
        { type: 'heading', content: '二、为什么需要意定监护' },
        { type: 'paragraph', content: '随着年龄增长,可能面临:' },
        { type: 'list', content: ['患老年痴呆、中风等疾病,丧失行为能力', '无法管理财产、签署文件', '无法就医疗、养老等事务做决定', '子女争夺监护权,产生纠纷'] },
        { type: 'case', content: '案例:张大爷患老年痴呆后,三个子女争夺监护权。因张大爷未订立意定监护,法院只能按法定顺序指定,导致家庭矛盾激化。' },
        { type: 'heading', content: '三、谁可以担任意定监护人' },
        { type: 'list', content: ['近亲属:配偶、子女、父母、兄弟姐妹等', '其他愿意担任监护人的个人', '民政部门或村(居)委会', '养老机构、社会组织'] },
        { type: 'quote', content: '注意:监护人应具备完全民事行为能力,有监护能力,且愿意承担监护职责。' },
        { type: 'heading', content: '四、意定监护的内容' },
        { type: 'paragraph', content: '意定监护协议应明确:' },
        { type: 'list', content: ['监护人的姓名、身份信息', '监护权的启动条件(如医院诊断为无行为能力)', '监护人的职责:生活照料、财产管理、医疗决策等', '监护人的报酬(如有)', '监护监督人(可选)', '协议的变更和解除'] },
        { type: 'heading', content: '五、意定监护的办理流程' },
        { type: 'paragraph', content: '步骤一:选定监护人并协商' },
        { type: 'list', content: ['选择信任的人担任监护人', '与监护人充分沟通,达成一致'] },
        { type: 'paragraph', content: '步骤二:准备材料' },
        { type: 'list', content: ['本人及监护人的身份证、户口本', '监护协议书草稿', '房产证、银行卡等财产证明(用于明确监护财产范围)'] },
        { type: 'paragraph', content: '步骤三:到公证处办理' },
        { type: 'list', content: ['本人和监护人共同到公证处', '公证员询问双方意愿', '签署意定监护协议', '领取公证书'] },
        { type: 'paragraph', content: '步骤四:协议生效' },
        { type: 'list', content: ['协议签订后即生效', '但监护职责在本人丧失行为能力时才启动', '建议将公证书交亲友、律师等保管一份'] },
        { type: 'heading', content: '六、常见问题' },
        { type: 'paragraph', content: 'Q1:意定监护可以变更吗?' },
        { type: 'paragraph', content: 'A:可以。在本人仍有行为能力时,可以变更或解除意定监护协议,但需与原监护人协商或另行公证。' },
        { type: 'paragraph', content: 'Q2:意定监护和遗嘱有什么区别?' },
        { type: 'paragraph', content: 'A:意定监护是管理生前事务(失能后的生活、财产),遗嘱是安排身后财产。两者可以结合使用。' },
        { type: 'paragraph', content: 'Q3:费用如何?' },
        { type: 'paragraph', content: 'A:公证费一般几百元,各地略有不同。' },
      ],
      relatedArticles: ['article_will_001', 'article_support_001'],
    },
  ];

  // ==================== Data Loading ====================

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      const bookmarkData = await AsyncStorage.getItem('article_bookmarks');
      if (bookmarkData) {
        const bookmarkArray: ArticleBookmark[] = JSON.parse(bookmarkData);
        const bookmarkSet = new Set<string>(bookmarkArray.map(b => b.articleId));
        setBookmarks(bookmarkSet);
      }

      const historyData = await AsyncStorage.getItem('article_read_history');
      if (historyData) {
        const historyArray: ReadHistory[] = JSON.parse(historyData);
        setReadHistory(historyArray);
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    }
  };

  const saveReadHistory = async (articleId: string) => {
    const history: ReadHistory = {
      articleId,
      readAt: new Date().toISOString(),
    };

    const newHistory = readHistory.filter(h => h.articleId !== articleId);
    newHistory.unshift(history);
    const trimmedHistory = newHistory.slice(0, 50);
    setReadHistory(trimmedHistory);

    try {
      await AsyncStorage.setItem('article_read_history', JSON.stringify(trimmedHistory));
    } catch (error) {
      console.error('Failed to save read history:', error);
    }
  };

  const toggleBookmark = async (articleId: string) => {
    const newBookmarks = new Set(bookmarks);

    if (newBookmarks.has(articleId)) {
      newBookmarks.delete(articleId);
      Alert.alert('提示', '已取消收藏');
    } else {
      newBookmarks.add(articleId);
      Alert.alert('提示', '收藏成功');
    }

    setBookmarks(newBookmarks);

    try {
      const bookmarkArray: ArticleBookmark[] = Array.from(newBookmarks).map(id => ({
        articleId: id,
        bookmarkedAt: new Date().toISOString(),
      }));
      await AsyncStorage.setItem('article_bookmarks', JSON.stringify(bookmarkArray));
    } catch (error) {
      console.error('Failed to save bookmarks:', error);
    }
  };

  const handleShareArticle = async () => {
    if (!selectedArticle) return;

    try {
      await Share.share({
        message: `【康养法律】${selectedArticle.title}\n\n${selectedArticle.summary}\n\n来自康养APP法律文章库`,
      });
    } catch (error) {
      console.error('Share failed:', error);
    }
  };

  // ==================== Search ====================

  const handleSearch = (query: string) => {
    setSearchQuery(query);

    if (query.trim() === '') {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);

    const results = LEGAL_ARTICLES.filter(article => {
      const lowerQuery = query.toLowerCase();
      return (
        article.title.toLowerCase().includes(lowerQuery) ||
        article.summary.toLowerCase().includes(lowerQuery) ||
        article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
      );
    });

    setSearchResults(results);
  };

  // ==================== Navigation ====================

  const handleCategoryPress = (category: ArticleCategory) => {
    setSelectedCategory(category);
    const filteredArticles = LEGAL_ARTICLES.filter(a => a.categoryId === category.id);
    setArticleList(filteredArticles);
    setCurrentStep('articleList');
  };

  const handleArticlePress = (article: LegalArticle) => {
    setSelectedArticle(article);
    saveReadHistory(article.id);
    setCurrentStep('articleDetail');
  };

  const handleBackPress = () => {
    if (currentStep === 'articleDetail') {
      setCurrentStep('articleList');
      setSelectedArticle(null);
    } else if (currentStep === 'articleList') {
      setCurrentStep('categories');
      setSelectedCategory(null);
      setArticleList([]);
      setSearchQuery('');
      setSearchResults([]);
      setIsSearching(false);
    } else {
      navigation.goBack();
    }
  };

  // ==================== Render Methods ====================

  const renderCategoryCard = (category: ArticleCategory) => (
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
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$1">
            {category.name}
          </Text>
          <Text fontSize="$2" color="$color10" marginBottom="$1">
            {category.description}
          </Text>
          <XStack alignItems="center">
            <FileText size={14} color={color10} />
            <Text fontSize="$2" color="$color10" marginLeft="$1">
              {category.articleCount} 篇文章
            </Text>
          </XStack>
        </YStack>
        <ChevronRight size={20} color={color9} />
      </XStack>
    </Pressable>
  );

  const renderArticleCard = (article: LegalArticle) => {
    const isBookmarked = bookmarks.has(article.id);
    const hasRead = readHistory.some(h => h.articleId === article.id);

    return (
      <Pressable key={article.id} onPress={() => handleArticlePress(article)}>
        <YStack
          backgroundColor="$color2"
          borderRadius="$4"
          padding="$2"
          marginBottom="$2"
          borderWidth={1}
          borderColor="$color5"
        >
          <XStack justifyContent="space-between" alignItems="flex-start" marginBottom="$1.5">
            <Text flex={1} fontSize="$4" fontWeight="600" color="$color12" lineHeight={24}>
              {article.title}
            </Text>
            {isBookmarked && (
              <Bookmark size={20} color={primaryColor} fill={primaryColor} style={{ marginLeft: 8 }} />
            )}
          </XStack>
          <Text fontSize="$3" color="$color10" lineHeight={22} marginBottom="$2" numberOfLines={3}>
            {article.summary}
          </Text>
          <XStack flexWrap="wrap" marginBottom="$2" gap="$1.5">
            {article.tags.slice(0, 3).map((tag, index) => (
              <View
                key={index}
                backgroundColor="$color4"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$color10">{tag}</Text>
              </View>
            ))}
          </XStack>
          <XStack alignItems="center" flexWrap="wrap" gap="$2">
            <XStack alignItems="center">
              <User size={14} color={color9} />
              <Text fontSize="$2" color="$color9" marginLeft="$0.5">{article.author}</Text>
            </XStack>
            <XStack alignItems="center">
              <Clock size={14} color={color9} />
              <Text fontSize="$2" color="$color9" marginLeft="$0.5">{article.readTime}分钟</Text>
            </XStack>
            <XStack alignItems="center">
              <Eye size={14} color={color9} />
              <Text fontSize="$2" color="$color9" marginLeft="$0.5">{formatViews(article.views)}</Text>
            </XStack>
            {hasRead && (
              <View
                backgroundColor="$color4"
                paddingHorizontal="$1.5"
                paddingVertical="$0.5"
                borderRadius="$2"
              >
                <Text fontSize={11} color="$primary">已读</Text>
              </View>
            )}
          </XStack>
        </YStack>
      </Pressable>
    );
  };

  const renderArticleContent = (content: ArticleContent, index: number) => {
    switch (content.type) {
      case 'heading':
        return (
          <Text key={index} fontSize="$5" fontWeight="600" color="$color12" marginTop="$4" marginBottom="$2">
            {content.content as string}
          </Text>
        );
      case 'paragraph':
        return (
          <Text key={index} fontSize="$3" color="$color12" lineHeight={26} marginBottom="$2">
            {content.content as string}
          </Text>
        );
      case 'list':
        return (
          <YStack key={index} marginBottom="$2.5">
            {(content.content as string[]).map((item, i) => (
              <XStack key={i} marginBottom="$1.5">
                <Text fontSize="$3" color="$primary" fontWeight="bold" marginRight="$1.5">•</Text>
                <Text flex={1} fontSize="$3" color="$color12" lineHeight={24}>{item}</Text>
              </XStack>
            ))}
          </YStack>
        );
      case 'quote':
        return (
          <XStack
            key={index}
            backgroundColor="$color4"
            borderLeftWidth={4}
            borderLeftColor={GOLD_COLOR}
            padding="$2"
            marginVertical="$2"
          >
            <AlertCircle size={20} color={GOLD_COLOR} />
            <Text flex={1} fontSize="$3" color="$color10" lineHeight={22} marginLeft="$1.5">
              {content.content as string}
            </Text>
          </XStack>
        );
      case 'case':
        return (
          <View
            key={index}
            backgroundColor="$color4"
            borderRadius="$3"
            padding="$2"
            marginVertical="$2"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <XStack alignItems="center" marginBottom="$1.5">
              <FolderOpen size={18} color={primaryColor} />
              <Text fontSize="$3" fontWeight="600" color="$primary" marginLeft="$1">案例</Text>
            </XStack>
            <Text fontSize="$3" color="$color10" lineHeight={22}>
              {content.content as string}
            </Text>
          </View>
        );
      default:
        return null;
    }
  };

  // ==================== Screen Views ====================

  const renderCategoriesView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TitleBar title="法律文章库" onBack={handleBackPress} />

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
          placeholder="搜索法律文章..."
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

      {/* Content */}
      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {!isSearching ? (
          <>
            {/* Banner */}
            <View backgroundColor="$color2" margin="$2.5" borderRadius="$4" padding="$4" alignItems="center">
              <Library size={40} color={primaryColor} />
              <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$2">
                专业法律文章，守护您的权益
              </Text>
              <Text fontSize="$3" color="$color10" marginTop="$1">
                律师撰写 · 案例丰富 · 实用指南
              </Text>
            </View>

            {/* Categories */}
            <YStack marginBottom="$4">
              <YStack paddingHorizontal="$2.5" marginBottom="$2">
                <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$1">文章分类</Text>
                <Text fontSize="$3" color="$color9">选择您关心的主题</Text>
              </YStack>
              {ARTICLE_CATEGORIES.map(category => renderCategoryCard(category))}
            </YStack>

            {/* Recent Reading */}
            {readHistory.length > 0 && (
              <YStack marginBottom="$4" paddingHorizontal="$2.5">
                <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">最近阅读</Text>
                {readHistory.slice(0, 3).map(history => {
                  const article = LEGAL_ARTICLES.find(a => a.id === history.articleId);
                  return article ? renderArticleCard(article) : null;
                })}
              </YStack>
            )}

            {/* Bookmarks */}
            {bookmarks.size > 0 && (
              <YStack marginBottom="$4" paddingHorizontal="$2.5">
                <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
                  <Text fontSize="$5" fontWeight="600" color="$color12">我的收藏</Text>
                  <Text fontSize="$3" color="$color9">{bookmarks.size} 篇文章</Text>
                </XStack>
                {Array.from(bookmarks).slice(0, 3).map(bookmarkId => {
                  const article = LEGAL_ARTICLES.find(a => a.id === bookmarkId);
                  return article ? renderArticleCard(article) : null;
                })}
              </YStack>
            )}
          </>
        ) : (
          /* Search Results */
          <YStack paddingHorizontal="$2.5" marginTop="$2">
            <XStack justifyContent="space-between" alignItems="center" marginBottom="$2">
              <Text fontSize="$5" fontWeight="600" color="$color12">搜索结果</Text>
              <Text fontSize="$3" color="$color9">找到 {searchResults.length} 篇文章</Text>
            </XStack>
            {searchResults.length > 0 ? (
              searchResults.map(article => renderArticleCard(article))
            ) : (
              <YStack alignItems="center" paddingVertical="$8">
                <Search size={64} color={color9} />
                <Text fontSize="$4" color="$color9" marginTop="$2">未找到相关文章</Text>
                <Text fontSize="$3" color="$color9" marginTop="$1">试试其他关键词吧</Text>
              </YStack>
            )}
          </YStack>
        )}

        <View height={30} />
      </ScrollView>
    </View>
  );

  const renderArticleListView = () => (
    <View flex={1} backgroundColor="$background">
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <TitleBar title={selectedCategory?.name || ''} onBack={handleBackPress} />

      {/* Category Info */}
      {selectedCategory && (
        <XStack
          alignItems="center"
          padding="$2"
          marginHorizontal="$2.5"
          marginTop="$2"
          marginBottom="$1"
          borderRadius="$4"
          style={{ backgroundColor: `${selectedCategory.color}10` }}
        >
          <CategoryIcon icon={selectedCategory.icon} color={selectedCategory.color} size={28} />
          <YStack flex={1} marginLeft="$2">
            <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$0.5">
              {selectedCategory.name}
            </Text>
            <Text fontSize="$2" color="$color10">
              {selectedCategory.description}
            </Text>
          </YStack>
        </XStack>
      )}

      {/* Article List */}
      <FlatList
        data={articleList}
        renderItem={({ item }) => renderArticleCard(item)}
        keyExtractor={item => item.id}
        contentContainerStyle={{ paddingHorizontal: 14, paddingTop: 8, paddingBottom: 30 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );

  const renderArticleDetailView = () => {
    if (!selectedArticle) return null;

    const isBookmarked = bookmarks.has(selectedArticle.id);
    const relatedArticles = LEGAL_ARTICLES.filter(a => selectedArticle.relatedArticles.includes(a.id));

    return (
      <View flex={1} backgroundColor="$background">
        <StatusBar barStyle="dark-content" />

        {/* Header */}
        <TitleBar
          title="文章详情"
          onBack={handleBackPress}
          rightActions={
            <XStack alignItems="center" gap="$2">
              <Pressable onPress={() => toggleBookmark(selectedArticle.id)}>
                <Bookmark
                  size={24}
                  color={isBookmarked ? primaryColor : color10}
                  fill={isBookmarked ? primaryColor : 'transparent'}
                />
              </Pressable>
              <Pressable onPress={handleShareArticle}>
                <Share2 size={24} color={color10} />
              </Pressable>
            </XStack>
          }
        />

        <ScrollView flex={1} backgroundColor="$color2" showsVerticalScrollIndicator={false}>
          {/* Title */}
          <Text
            fontSize="$6"
            fontWeight="600"
            color="$color12"
            lineHeight={32}
            paddingHorizontal="$2.5"
            paddingTop="$4"
            marginBottom="$2"
          >
            {selectedArticle.title}
          </Text>

          {/* Meta */}
          <XStack alignItems="center" flexWrap="wrap" paddingHorizontal="$2.5" marginBottom="$2" gap="$2.5">
            <XStack alignItems="center">
              <User size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1">{selectedArticle.author}</Text>
            </XStack>
            <XStack alignItems="center">
              <Calendar size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1">{formatDate(selectedArticle.publishDate)}</Text>
            </XStack>
            <XStack alignItems="center">
              <Clock size={16} color={color10} />
              <Text fontSize="$2" color="$color10" marginLeft="$1">{selectedArticle.readTime}分钟</Text>
            </XStack>
          </XStack>

          {/* Tags */}
          <XStack flexWrap="wrap" paddingHorizontal="$2.5" marginBottom="$2.5" gap="$1.5">
            {selectedArticle.tags.map((tag, index) => (
              <View
                key={index}
                backgroundColor="$color4"
                paddingHorizontal="$2"
                paddingVertical="$1"
                borderRadius="$2"
              >
                <Text fontSize="$2" color="$color10">{tag}</Text>
              </View>
            ))}
          </XStack>

          {/* Summary */}
          <XStack
            marginHorizontal="$2.5"
            padding="$2"
            borderRadius="$3"
            marginBottom="$4"
            style={{ backgroundColor: `${primaryColor}10` }}
          >
            <Info size={20} color={primaryColor} />
            <Text flex={1} fontSize="$3" color="$primary" lineHeight={22} marginLeft="$1.5">
              {selectedArticle.summary}
            </Text>
          </XStack>

          {/* Content */}
          <YStack paddingHorizontal="$2.5">
            {selectedArticle.content.map((item, index) => renderArticleContent(item, index))}
          </YStack>

          {/* Related Articles */}
          {relatedArticles.length > 0 && (
            <YStack marginTop="$4" paddingTop="$4" borderTopWidth={1} borderTopColor="$color5" paddingHorizontal="$2.5">
              <Text fontSize="$5" fontWeight="600" color="$color12" marginBottom="$2">相关文章</Text>
              {relatedArticles.map(article => renderArticleCard(article))}
            </YStack>
          )}

          <View height={30} />
        </ScrollView>
      </View>
    );
  };

  // ==================== Main Render ====================

  if (currentStep === 'categories') {
    return renderCategoriesView();
  } else if (currentStep === 'articleList') {
    return renderArticleListView();
  } else if (currentStep === 'articleDetail') {
    return renderArticleDetailView();
  }

  return null;
};

export default LegalArticleScreen;
