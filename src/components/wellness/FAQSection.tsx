/**
 * FAQ常见问题组件
 * 折叠式问答列表，消除用户顾虑
 */

import React, { useState } from 'react';
import { View, Text, YStack, useTheme } from 'tamagui';
import { Pressable, LayoutAnimation, Platform, UIManager } from 'react-native';
import { ChevronDown, HelpCircle } from 'lucide-react-native';

// Enable LayoutAnimation for Android
if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

export interface FAQItem {
  id: string;
  category: 'service' | 'pricing' | 'security' | 'effectiveness';
  categoryLabel: string;
  question: string;
  answer: string;
  relatedServices?: string[]; // 相关服务
}

interface FAQItemProps {
  faq: FAQItem;
  isExpanded: boolean;
  onToggle: () => void;
}

const FAQItemComponent: React.FC<FAQItemProps> = ({ faq, isExpanded, onToggle }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  const handleToggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    onToggle();
  };

  return (
    <Pressable onPress={handleToggle}>
      <View
        backgroundColor="$color2"
        borderRadius="$5"
        borderWidth={1}
        borderColor={isExpanded ? primaryColor : '$color5'}
        padding="$2"
        marginBottom="$2"
      >
        <YStack gap="$2">
          {/* 问题标题 */}
          <View
            flexDirection="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <View flexDirection="row" alignItems="center" flex={1} gap="$2">
              <HelpCircle
                size={18}
                color={isExpanded ? primaryColor : theme.color10?.val}
              />
              <Text
                fontSize="$3"
                fontWeight="600"
                color={isExpanded ? '$color9' : '$color12'}
                flex={1}
                lineHeight={22}
              >
                {faq.question}
              </Text>
            </View>
            <View
              style={{
                transform: [{ rotate: isExpanded ? '180deg' : '0deg' }],
                transition: 'transform 0.3s',
              }}
            >
              <ChevronDown
                size={20}
                color={isExpanded ? primaryColor : theme.color10?.val}
              />
            </View>
          </View>

          {/* 答案内容 */}
          {isExpanded && (
            <View
              backgroundColor="$color3"
              padding="$3"
              borderRadius="$2"
              marginTop="$2"
            >
              <Text fontSize="$3" color="$color12" lineHeight={22}>
                {faq.answer}
              </Text>
              {faq.relatedServices && faq.relatedServices.length > 0 && (
                <View marginTop="$2">
                  <Text fontSize="$2" color="$color10">
                    相关服务：{faq.relatedServices.join('、')}
                  </Text>
                </View>
              )}
            </View>
          )}
        </YStack>
      </View>
    </Pressable>
  );
};

interface FAQSectionProps {
  faqs: FAQItem[];
  defaultExpandedId?: string;
}

export const FAQSection: React.FC<FAQSectionProps> = ({ faqs, defaultExpandedId }) => {
  const theme = useTheme();
  const primaryColor = theme.primary?.val;

  const [expandedId, setExpandedId] = useState<string | null>(defaultExpandedId || null);

  const handleToggle = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  // 按类别分组
  const faqsByCategory = faqs.reduce((acc, faq) => {
    if (!acc[faq.category]) {
      acc[faq.category] = [];
    }
    acc[faq.category].push(faq);
    return acc;
  }, {} as Record<string, FAQItem[]>);

  const categoryOrder = ['service', 'pricing', 'security', 'effectiveness'];
  const categoryLabels = {
    service: '服务相关',
    pricing: '费用相关',
    security: '安全相关',
    effectiveness: '效果相关',
  };

  return (
    <View marginBottom="$2">
      <YStack gap="$3">
        {/* 标题 */}
        <View paddingHorizontal="$2.5">
          <Text fontSize="$5" fontWeight="600" color="$color12">
            常见问题
          </Text>
          <Text fontSize="$3" color="$color10" marginTop="$1">
            解答您的疑问，消除顾虑
          </Text>
        </View>

        {/* FAQ列表 */}
        <View paddingHorizontal="$2.5">
          <YStack>
            {categoryOrder.map(
              (category) =>
                faqsByCategory[category] && (
                  <YStack key={category} marginBottom="$2">
                    {/* 类别标签 */}
                    <View
                      backgroundColor="$color4"
                      paddingHorizontal="$2.5"
                      paddingVertical="$2"
                      borderRadius="$2"
                      alignSelf="flex-start"
                      marginBottom="$2"
                    >
                      <Text
                        fontSize="$2"
                        color="$color9"
                        fontWeight="600"
                      >
                        {categoryLabels[category as keyof typeof categoryLabels]}
                      </Text>
                    </View>

                    {/* 该类别下的FAQ项 */}
                    {faqsByCategory[category].map((faq) => (
                      <FAQItemComponent
                        key={faq.id}
                        faq={faq}
                        isExpanded={expandedId === faq.id}
                        onToggle={() => handleToggle(faq.id)}
                      />
                    ))}
                  </YStack>
                )
            )}
          </YStack>
        </View>
      </YStack>
    </View>
  );
};

/**
 * Mock FAQ数据
 */
export const mockFAQs: FAQItem[] = [
  // 服务相关
  {
    id: 'faq_service_001',
    category: 'service',
    categoryLabel: '服务相关',
    question: '服务范围覆盖哪些城市？',
    answer:
      '目前我们的服务已覆盖北京、上海、广州、深圳等一线城市，以及杭州、成都、武汉等30+重点城市。部分在线咨询服务（如AI健康规划、专家咨询）面向全国开放。',
    relatedServices: ['营养配餐', '闪送到家', '养老服务'],
  },
  {
    id: 'faq_service_002',
    category: 'service',
    categoryLabel: '服务相关',
    question: '如果对服务不满意，可以退款吗？',
    answer:
      '我们提供7天无理由退款服务。如果您在服务开始后的7天内不满意，可以申请全额退款。超过7天但未满30天的，可按比例退款。我们的目标是让每位用户都满意。',
  },
  {
    id: 'faq_service_003',
    category: 'service',
    categoryLabel: '服务相关',
    question: '可以更换服务人员吗？',
    answer:
      '当然可以。如果您对服务人员不满意，可以随时通过APP申请更换。我们会在24小时内为您安排新的服务人员，确保服务质量不受影响。',
    relatedServices: ['养老服务', '私人医生'],
  },
  {
    id: 'faq_service_004',
    category: 'service',
    categoryLabel: '服务相关',
    question: '营养配餐是否考虑个人口味偏好？',
    answer:
      '是的，我们的营养师会在制定食谱前详细了解您的口味偏好、饮食习惯、过敏食物等信息。在满足营养需求的前提下，尽可能按照您的口味来搭配菜品。',
    relatedServices: ['营养配餐', '闪送到家'],
  },

  // 费用相关
  {
    id: 'faq_pricing_001',
    category: 'pricing',
    categoryLabel: '费用相关',
    question: '为什么有些服务是免费的？',
    answer:
      '我们提供的免费服务（如AI健康规划、专家首次咨询）是为了让您零门槛体验我们的专业服务。我们相信，当您了解我们的服务质量后，会选择更深入的服务方案。这是我们对服务质量的信心。',
    relatedServices: ['AI健康规划', '专家咨询', '遗嘱法律', '保险规划'],
  },
  {
    id: 'faq_pricing_002',
    category: 'pricing',
    categoryLabel: '费用相关',
    question: '套餐服务比单项服务便宜多少？',
    answer:
      '套餐服务通常比单独购买各项服务节省15%-20%。例如，健康养老全包套餐包含营养配餐、私人医生和养老服务，单独购买需要1196元/月，套餐价仅999元/月，节省197元。',
    relatedServices: ['组合套餐'],
  },
  {
    id: 'faq_pricing_003',
    category: 'pricing',
    categoryLabel: '费用相关',
    question: '可以按月付费吗？还是必须一次性支付？',
    answer:
      '我们提供灵活的付费方式。大部分服务支持按月付费，部分服务也提供季度和年度套餐（享受更多优惠）。您可以根据自己的需求选择合适的付费周期。',
  },
  {
    id: 'faq_pricing_004',
    category: 'pricing',
    categoryLabel: '费用相关',
    question: '有优惠活动吗？',
    answer:
      '我们定期推出优惠活动。新用户首次订购享受特别折扣，节假日也会有促销活动。建议关注首页的今日推荐和限时优惠。订阅我们的服务通知，第一时间获取优惠信息。',
  },

  // 安全相关
  {
    id: 'faq_security_001',
    category: 'security',
    categoryLabel: '安全相关',
    question: '我的健康数据和个人信息安全吗？',
    answer:
      '您的数据安全是我们的首要任务。我们采用银行级别的加密技术保护您的信息，所有健康数据都经过加密存储。我们严格遵守数据保护法规，未经您的明确授权，绝不会向任何第三方分享您的个人信息。',
  },
  {
    id: 'faq_security_002',
    category: 'security',
    categoryLabel: '安全相关',
    question: '服务人员是否经过专业培训和背景审查？',
    answer:
      '是的，所有服务人员都经过严格的资质审查、专业培训和背景调查。我们的营养师、医生、律师、护理人员均持有相关职业资格证书，并定期接受专业培训和服务质量考核。',
    relatedServices: ['营养配餐', '私人医生', '养老服务'],
  },
  {
    id: 'faq_security_003',
    category: 'security',
    categoryLabel: '安全相关',
    question: '遗嘱和法律文件的保密性如何保障？',
    answer:
      '我们的律师严格遵守律师职业道德和保密义务。所有遗嘱和法律文件都采用加密存储，只有您本人和授权律师可以访问。您可以随时查看、修改或删除您的文件。',
    relatedServices: ['遗嘱法律'],
  },

  // 效果相关
  {
    id: 'faq_effectiveness_001',
    category: 'effectiveness',
    categoryLabel: '效果相关',
    question: '多久能看到健康改善效果？',
    answer:
      '这取决于您的具体情况和服务类型。一般来说，营养配餐服务1-2周即可感受到精力改善，1-3个月可以看到体检指标的变化。慢病管理通常需要3-6个月持续跟踪才能看到显著效果。我们会定期为您进行健康评估。',
    relatedServices: ['营养配餐', '私人医生', '慢病管理'],
  },
  {
    id: 'faq_effectiveness_002',
    category: 'effectiveness',
    categoryLabel: '效果相关',
    question: 'AI健康规划准确吗？',
    answer:
      'AI健康规划基于大量医学数据和专业算法，准确率高达90%以上。不过，AI分析结果仅供参考，我们建议结合专业医生的诊断意见。您可以使用免费的AI规划初步了解健康状况，然后预约医生进行深入咨询。',
    relatedServices: ['AI健康规划', '私人医生'],
  },
  {
    id: 'faq_effectiveness_003',
    category: 'effectiveness',
    categoryLabel: '效果相关',
    question: '如果效果不明显怎么办？',
    answer:
      '我们会根据您的反馈持续优化服务方案。如果效果不明显，您可以随时联系您的专属顾问或医生，我们会重新评估您的情况，调整服务方案。我们的目标是确保每位用户都能获得实实在在的改善。',
  },
  {
    id: 'faq_effectiveness_004',
    category: 'effectiveness',
    categoryLabel: '效果相关',
    question: '保险规划真的能帮我省钱吗？',
    answer:
      '是的。我们的AI会分析您当前的保障缺口，推荐性价比最高的产品组合。根据统计，通过我们规划的用户平均节省30%-40%的保费支出，同时获得更全面的保障。而且我们的规划咨询完全免费。',
    relatedServices: ['保险规划'],
  },
];
