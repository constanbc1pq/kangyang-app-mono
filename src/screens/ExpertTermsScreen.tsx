/**
 * ExpertTermsScreen - 达人服务协议条款页
 * 展示完整的达人服务协议内容
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileText,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  Scale,
  UserCheck,
  XCircle,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';

interface ExpertTermsScreenProps {
  navigation: any;
}

/**
 * 达人服务协议条款页
 */
export const ExpertTermsScreen: React.FC<ExpertTermsScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  // 协议章节数据
  const sections = [
    {
      id: 'overview',
      icon: FileText,
      title: '一、协议概述',
      iconColor: primaryColor,
      content: [
        '本协议是您（以下简称"达人"）与康养平台（以下简称"平台"）之间就达人服务相关事宜签订的协议。',
        '达人通过平台向用户提供各类生活服务，包括但不限于家政服务、维修服务、教育培训、健康咨询等。',
        '请您在申请成为达人前仔细阅读本协议，一旦提交申请即视为同意本协议全部条款。',
      ],
    },
    {
      id: 'qualification',
      icon: UserCheck,
      title: '二、达人资质要求',
      iconColor: successColor,
      content: [
        '【个人达人】年满18周岁，具有完全民事行为能力的自然人。',
        '【商家达人】依法注册成立的企业或个体工商户，具有合法经营资质。',
        '达人需提供真实、有效的身份证明材料，商家达人需提供营业执照等资质证明。',
        '达人所从事的服务领域需具备相应的专业技能或资质证书。',
        '达人无重大违法犯罪记录，无严重失信行为记录。',
      ],
    },
    {
      id: 'rights',
      icon: Shield,
      title: '三、达人权利',
      iconColor: primaryColor,
      content: [
        '享有平台流量扶持，优先展示给有需求的用户。',
        '通过完成订单获取服务收入，平台按约定比例结算。',
        '享有平台担保交易保障，降低服务风险。',
        '参与达人等级评定，优质达人享有更多推广资源和权益。',
        '获得平台提供的技能培训、运营指导等增值服务。',
        '有权就服务纠纷向平台申请调解和仲裁。',
      ],
    },
    {
      id: 'obligations',
      icon: CheckCircle,
      title: '四、达人义务',
      iconColor: successColor,
      content: [
        '保持服务质量，好评率需达到90%及以上。',
        '收到用户订单后，需在30分钟内响应，24小时内确认服务时间。',
        '如实描述服务内容、服务价格、服务时效等信息。',
        '严格遵守平台服务规范和本协议约定。',
        '保护用户隐私，不得泄露用户个人信息。',
        '不得通过虚假交易、刷单等方式获取不正当利益。',
        '及时处理用户投诉和售后问题，维护良好服务口碑。',
      ],
    },
    {
      id: 'pricing',
      icon: DollarSign,
      title: '五、费用说明',
      iconColor: warningColor,
      content: [
        '【个人达人认证费】¥500/年，适合个人技能服务者。',
        '【商家达人认证费】¥2000/年，适合商户/企业，享更多推广权益。',
        '认证费用自支付成功之日起计算，有效期为一年。',
        '平台对每笔成交订单收取10%-20%的服务费（根据服务类目不同而异）。',
        '达人收入按月结算，次月15日前统一发放至达人绑定的银行账户。',
        '认证费用一经缴纳，除特殊情况外不予退还。',
      ],
    },
    {
      id: 'termination',
      icon: XCircle,
      title: '六、协议终止',
      iconColor: errorColor,
      content: [
        '达人认证有效期届满未续费的，协议自动终止。',
        '达人可申请提前解约，需提前30天提交书面申请。',
        '提前解约的，剩余认证费用按实际剩余天数比例退还（扣除20%手续费）。',
        '达人存在严重违规行为的，平台有权单方面终止协议，不退还认证费用。',
        '协议终止后，达人账户将转为普通用户账户，历史服务记录保留。',
      ],
    },
    {
      id: 'violations',
      icon: AlertTriangle,
      title: '七、违规处理',
      iconColor: warningColor,
      content: [
        '【警告】首次轻微违规，给予警告并限期整改。',
        '【限流】累计3次警告或中度违规，限制接单数量7-30天。',
        '【暂停】严重违规或累计5次警告，暂停达人资格30-90天。',
        '【清退】存在欺诈、违法等重大违规行为，永久清退并保留追责权利。',
        '违规行为包括但不限于：虚假宣传、服务不达标、恶意差评、私下交易等。',
      ],
    },
    {
      id: 'disputes',
      icon: Scale,
      title: '八、争议解决',
      iconColor: primaryColor,
      content: [
        '因本协议引起的或与本协议有关的争议，双方应友好协商解决。',
        '协商不成的，任何一方均可向平台注册地人民法院提起诉讼。',
        '本协议的签订、履行、变更、解除、终止等均适用中华人民共和国法律。',
        '本协议条款如与国家法律法规相冲突，以国家法律法规为准。',
      ],
    },
    {
      id: 'others',
      icon: Clock,
      title: '九、其他条款',
      iconColor: color10,
      content: [
        '平台有权根据运营需要修订本协议，修订后的协议将在平台公示。',
        '达人继续使用平台服务即视为接受修订后的协议。',
        '本协议未尽事宜，以平台公布的相关规则为准。',
        '本协议自达人提交认证申请并支付认证费用之日起生效。',
        '协议最终解释权归康养平台所有。',
      ],
    },
  ];

  // 渲染协议头部信息
  const renderAgreementHeader = () => (
    <View
      marginHorizontal="$2.5"
      marginTop="$2"
      backgroundColor="$color2"
      borderRadius="$5"
      padding="$3"
      borderWidth={1}
      borderColor="$color5"
      alignItems="center"
    >
      <View
        width={60}
        height={60}
        borderRadius={30}
        backgroundColor={`${primaryColor}15`}
        justifyContent="center"
        alignItems="center"
        marginBottom="$2"
      >
        <FileText size={32} color={primaryColor} />
      </View>
      <Text fontSize="$5" fontWeight="700" color="$color12" textAlign="center">
        康养平台达人服务协议
      </Text>
      <Text fontSize="$3" color="$color10" marginTop="$1" textAlign="center">
        版本号：v2.0｜生效日期：2024年1月1日
      </Text>
      <View
        marginTop="$2"
        backgroundColor="$color4"
        paddingHorizontal="$3"
        paddingVertical="$1.5"
        borderRadius="$10"
      >
        <Text fontSize="$2" color="$color10">
          请仔细阅读以下协议条款
        </Text>
      </View>
    </View>
  );

  // 渲染协议章节
  const renderSection = (section: typeof sections[0]) => (
    <View
      key={section.id}
      marginHorizontal="$2.5"
      marginTop="$3"
      backgroundColor="$color2"
      borderRadius="$5"
      padding="$2"
      borderWidth={1}
      borderColor="$color5"
    >
      {/* 章节标题 */}
      <XStack gap="$2" alignItems="center" marginBottom="$2">
        <View
          width={32}
          height={32}
          borderRadius={16}
          backgroundColor={`${section.iconColor}15`}
          justifyContent="center"
          alignItems="center"
        >
          <section.icon size={16} color={section.iconColor} />
        </View>
        <Text fontSize="$4" fontWeight="600" color="$color12">
          {section.title}
        </Text>
      </XStack>

      {/* 章节内容 */}
      <YStack gap="$2" paddingLeft="$1">
        {section.content.map((item, index) => (
          <XStack key={index} gap="$2" alignItems="flex-start">
            <Text fontSize="$3" color="$color10" marginTop={2}>
              •
            </Text>
            <Text fontSize="$3" color="$color12" flex={1} lineHeight={22}>
              {item}
            </Text>
          </XStack>
        ))}
      </YStack>
    </View>
  );

  // 渲染底部说明
  const renderFooter = () => (
    <View
      marginHorizontal="$2.5"
      marginTop="$3"
      marginBottom="$4"
      backgroundColor="$color4"
      borderRadius="$5"
      padding="$3"
    >
      <XStack gap="$2" alignItems="center" marginBottom="$2">
        <AlertTriangle size={18} color={warningColor} />
        <Text fontSize="$3" fontWeight="600" color="$color12">
          重要提示
        </Text>
      </XStack>
      <Text fontSize="$3" color="$color10" lineHeight={22}>
        提交达人认证申请即表示您已阅读、理解并同意本协议的全部条款。如您对本协议有任何疑问，请在申请前联系平台客服咨询。
      </Text>
      <Text fontSize="$2" color="$color10" marginTop="$2">
        客服热线：400-888-8888｜服务时间：9:00-21:00
      </Text>
    </View>
  );

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar title="达人服务协议" />
      </View>

      {/* 滚动内容 */}
      <ScrollView
        flex={1}
        showsVerticalScrollIndicator={false}
      >
        {/* 协议头部 */}
        {renderAgreementHeader()}

        {/* 协议章节 */}
        {sections.map(section => renderSection(section))}

        {/* 底部说明 */}
        {renderFooter()}

        {/* 底部间距 */}
        <View height={insets.bottom + 20} />
      </ScrollView>
    </View>
  );
};
