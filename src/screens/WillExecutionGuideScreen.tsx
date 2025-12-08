/**
 * 遗嘱执行指引页面
 * 提供遗嘱执行流程说明和律师代办服务
 */

import React, { useState } from 'react';
import { Alert, TextInput, Linking, Pressable } from 'react-native';
import { YStack, XStack, Text, View, ScrollView, useTheme } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  FileLock,
  CheckCircle2,
  Phone,
  ChevronRight,
  Info,
} from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';
import { TitleBar } from '@/components/TitleBar';

const GOLD_COLOR = '#D4AF37';

const WillExecutionGuideScreen: React.FC = () => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const color10 = theme.color10?.val;

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState({
    name: '',
    phone: '',
    relationship: '',
    deceasedName: '',
    notes: '',
  });

  const handleRequestService = () => {
    if (!serviceForm.name || !serviceForm.phone || !serviceForm.deceasedName) {
      Alert.alert('提示', '请填写必填信息');
      return;
    }

    Alert.alert(
      '提交成功',
      '我们已收到您的申请，律师将在24小时内与您联系',
      [{ text: '确定', onPress: () => setShowServiceForm(false) }]
    );
  };

  const handleCallHotline = () => {
    Alert.alert(
      '遗嘱执行咨询热线',
      '400-XXX-XXXX\n\n服务时间：周一至周日 9:00-18:00',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '拨打',
          onPress: () => {
            Alert.alert('提示', '拨号功能仅在真实设备上可用');
          },
        },
      ]
    );
  };

  const executionSteps = [
    {
      title: '确认遗嘱有效性',
      items: ['核实遗嘱的真实性和合法性', '确认遗嘱未被撤销或变更', '检查遗嘱是否符合法律要求'],
    },
    {
      title: '通知相关方',
      items: ['通知所有受益人', '通知遗嘱执行人', '通知法定继承人'],
    },
    {
      title: '财产清点与评估',
      items: ['清点遗产范围', '评估财产价值', '核实债权债务'],
    },
    {
      title: '办理继承手续',
      items: ['申请继承权公证', '办理房产过户', '办理存款、证券等转移手续'],
    },
    {
      title: '财产分配',
      items: ['按照遗嘱内容分配财产', '处理特殊条款要求', '完成财产交付'],
    },
  ];

  const basicMaterials = ['死亡证明', '遗嘱原件', '立遗嘱人身份证明', '继承人身份证明', '亲属关系证明'];
  const propertyMaterials = ['房产证/不动产权证', '银行存款证明', '股票、基金账户证明', '其他财产证明材料'];

  const faqItems = [
    {
      question: '遗嘱执行需要多长时间？',
      answer: '一般情况下，简单的遗嘱执行需要3-6个月。如涉及复杂财产或纠纷，可能需要更长时间。',
    },
    {
      question: '遗嘱执行人有什么职责？',
      answer: '执行人负责管理遗产、清偿债务、按遗嘱分配财产、处理相关法律事务等。',
    },
    {
      question: '继承需要缴纳税费吗？',
      answer: '目前我国没有遗产税。但办理继承可能涉及公证费、过户费等费用。',
    },
    {
      question: '如果有人对遗嘱提出异议怎么办？',
      answer: '可以先尝试协商解决。如协商不成，需要通过法院诉讼解决。建议咨询专业律师。',
    },
  ];

  const serviceFeatures = ['材料准备指导', '公证手续代办', '房产过户办理', '纠纷调解处理', '全程法律咨询'];

  return (
    <View flex={1} backgroundColor="$background">
      {/* TitleBar */}
      <View paddingTop={insets.top}>
        <TitleBar title="遗嘱执行指引" />
      </View>

      <ScrollView flex={1} showsVerticalScrollIndicator={false}>
        {/* 顶部说明卡片 */}
        <View
          backgroundColor="$color2"
          alignItems="center"
          padding="$4"
          marginBottom="$1.5"
        >
          <FileLock size={48} color={primaryColor} />
          <Text fontSize="$5" fontWeight="600" color="$color12" marginTop="$2" marginBottom="$1">
            遗嘱执行服务
          </Text>
          <Text fontSize="$3" color="$color10" textAlign="center" lineHeight={20}>
            当遗嘱需要执行时，我们提供专业的法律支持和代办服务
          </Text>
        </View>

        {/* 执行流程 */}
        <View backgroundColor="$color2" padding="$2.5" marginBottom="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            遗嘱执行流程
          </Text>

          {executionSteps.map((step, index) => (
            <XStack key={index} marginBottom="$2.5">
              <View
                width={32}
                height={32}
                borderRadius={16}
                backgroundColor="$primary"
                alignItems="center"
                justifyContent="center"
                marginRight="$2"
              >
                <Text fontSize="$4" fontWeight="600" color="white">{index + 1}</Text>
              </View>
              <YStack flex={1}>
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                  {step.title}
                </Text>
                {step.items.map((item, itemIndex) => (
                  <Text key={itemIndex} fontSize="$2" color="$color10" lineHeight={20}>
                    • {item}
                  </Text>
                ))}
              </YStack>
            </XStack>
          ))}
        </View>

        {/* 所需材料 */}
        <View backgroundColor="$color2" padding="$2.5" marginBottom="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            办理继承所需材料
          </Text>

          <View backgroundColor="$color4" borderRadius="$4" padding="$2">
            <YStack marginBottom="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
                基础材料
              </Text>
              {basicMaterials.map((item, index) => (
                <XStack key={index} alignItems="center" marginBottom="$1">
                  <CheckCircle2 size={16} color={successColor} />
                  <Text fontSize="$2" color="$color10" marginLeft="$1">{item}</Text>
                </XStack>
              ))}
            </YStack>

            <YStack>
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1.5">
                财产相关材料
              </Text>
              {propertyMaterials.map((item, index) => (
                <XStack key={index} alignItems="center" marginBottom="$1">
                  <CheckCircle2 size={16} color={successColor} />
                  <Text fontSize="$2" color="$color10" marginLeft="$1">{item}</Text>
                </XStack>
              ))}
            </YStack>
          </View>
        </View>

        {/* 常见问题 */}
        <View backgroundColor="$color2" padding="$2.5" marginBottom="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            常见问题
          </Text>

          <View backgroundColor="$color4" borderRadius="$4" padding="$2">
            {faqItems.map((faq, index) => (
              <YStack key={index} marginBottom={index < faqItems.length - 1 ? '$2' : 0}>
                <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                  Q: {faq.question}
                </Text>
                <Text fontSize="$2" color="$color10" lineHeight={20}>
                  A: {faq.answer}
                </Text>
              </YStack>
            ))}
          </View>
        </View>

        {/* 律师代办服务 */}
        <View backgroundColor="$color2" padding="$2.5" marginBottom="$1.5">
          <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
            律师代办服务
          </Text>

          <View backgroundColor="$color4" borderRadius="$4" padding="$2">
            <Text fontSize="$3" color="$color10" lineHeight={20} marginBottom="$2">
              我们提供专业的遗嘱执行代办服务，由经验丰富的律师全程协助办理继承手续
            </Text>

            <YStack marginBottom="$2">
              {serviceFeatures.map((feature, index) => (
                <XStack key={index} alignItems="center" marginBottom="$1">
                  <CheckCircle2 size={18} color={primaryColor} />
                  <Text fontSize="$2" color="$color12" marginLeft="$1">{feature}</Text>
                </XStack>
              ))}
            </YStack>

            <View
              backgroundColor="$color2"
              borderRadius="$4"
              padding="$2"
              alignItems="center"
              marginBottom="$2"
            >
              <Text fontSize="$2" color="$color10">服务费用</Text>
              <Text fontSize="$7" fontWeight="700" color="$primary" marginVertical="$1">
                ¥5,000 起
              </Text>
              <Text fontSize="$1" color="$color10">根据案件复杂程度确定</Text>
            </View>

            {!showServiceForm ? (
              <Pressable onPress={() => setShowServiceForm(true)}>
                <View
                  backgroundColor="$primary"
                  borderRadius="$10"
                  paddingVertical="$2"
                  alignItems="center"
                >
                  <Text fontSize="$4" fontWeight="600" color="white">申请律师代办</Text>
                </View>
              </Pressable>
            ) : (
              <View backgroundColor="$color2" borderRadius="$4" padding="$2">
                <Text fontSize="$4" fontWeight="600" color="$color12" marginBottom="$2">
                  填写申请信息
                </Text>

                <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                  您的姓名 *
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.color5?.val,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    backgroundColor: theme.color2?.val,
                    color: theme.color12?.val,
                    marginBottom: 12,
                  }}
                  placeholder="请输入您的姓名"
                  placeholderTextColor={theme.color10?.val}
                  value={serviceForm.name}
                  onChangeText={text => setServiceForm({ ...serviceForm, name: text })}
                />

                <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                  联系电话 *
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.color5?.val,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    backgroundColor: theme.color2?.val,
                    color: theme.color12?.val,
                    marginBottom: 12,
                  }}
                  placeholder="请输入联系电话"
                  placeholderTextColor={theme.color10?.val}
                  value={serviceForm.phone}
                  onChangeText={text => setServiceForm({ ...serviceForm, phone: text })}
                  keyboardType="phone-pad"
                />

                <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                  与逝者关系 *
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.color5?.val,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    backgroundColor: theme.color2?.val,
                    color: theme.color12?.val,
                    marginBottom: 12,
                  }}
                  placeholder="例如：子女、配偶等"
                  placeholderTextColor={theme.color10?.val}
                  value={serviceForm.relationship}
                  onChangeText={text => setServiceForm({ ...serviceForm, relationship: text })}
                />

                <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                  逝者姓名 *
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.color5?.val,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    backgroundColor: theme.color2?.val,
                    color: theme.color12?.val,
                    marginBottom: 12,
                  }}
                  placeholder="请输入逝者姓名"
                  placeholderTextColor={theme.color10?.val}
                  value={serviceForm.deceasedName}
                  onChangeText={text => setServiceForm({ ...serviceForm, deceasedName: text })}
                />

                <Text fontSize="$3" fontWeight="500" color="$color12" marginBottom="$1">
                  其他说明
                </Text>
                <TextInput
                  style={{
                    borderWidth: 1,
                    borderColor: theme.color5?.val,
                    borderRadius: 8,
                    padding: 12,
                    fontSize: 14,
                    backgroundColor: theme.color2?.val,
                    color: theme.color12?.val,
                    height: 100,
                    textAlignVertical: 'top',
                    marginBottom: 16,
                  }}
                  placeholder="请简要说明情况"
                  placeholderTextColor={theme.color10?.val}
                  value={serviceForm.notes}
                  onChangeText={text => setServiceForm({ ...serviceForm, notes: text })}
                  multiline
                  numberOfLines={4}
                />

                <XStack gap="$2">
                  <Pressable style={{ flex: 1 }} onPress={() => setShowServiceForm(false)}>
                    <View
                      borderWidth={1}
                      borderColor="$color5"
                      borderRadius="$10"
                      paddingVertical="$2"
                      alignItems="center"
                    >
                      <Text fontSize="$3" color="$color10">取消</Text>
                    </View>
                  </Pressable>

                  <Pressable style={{ flex: 2 }} onPress={handleRequestService}>
                    <View
                      backgroundColor="$primary"
                      borderRadius="$10"
                      paddingVertical="$2"
                      alignItems="center"
                    >
                      <Text fontSize="$3" fontWeight="600" color="white">提交申请</Text>
                    </View>
                  </Pressable>
                </XStack>
              </View>
            )}
          </View>
        </View>

        {/* 咨询热线 */}
        <View backgroundColor="$color2" padding="$2.5" marginBottom="$1.5">
          <Pressable onPress={handleCallHotline}>
            <XStack
              backgroundColor="$color4"
              borderRadius="$4"
              padding="$2"
              alignItems="center"
            >
              <Phone size={24} color={primaryColor} />
              <YStack flex={1} marginLeft="$2">
                <Text fontSize="$3" color="$color10" marginBottom="$0.5">
                  遗嘱执行咨询热线
                </Text>
                <Text fontSize="$5" fontWeight="600" color="$primary">
                  400-XXX-XXXX
                </Text>
              </YStack>
              <ChevronRight size={20} color={color10} />
            </XStack>
          </Pressable>
        </View>

        {/* 法律提示 */}
        <View
          backgroundColor="$color2"
          borderRadius="$4"
          padding="$2"
          margin="$2.5"
        >
          <XStack alignItems="flex-start">
            <Info size={20} color={primaryColor} />
            <YStack flex={1} marginLeft="$2">
              <Text fontSize="$3" fontWeight="600" color="$color12" marginBottom="$1">
                重要提示
              </Text>
              <Text fontSize="$2" color="$color10" lineHeight={18}>
                1. 遗嘱执行应当严格按照遗嘱内容进行{'\n'}
                2. 如遇纠纷，建议及时寻求专业法律帮助{'\n'}
                3. 遗嘱执行人应当勤勉尽责，妥善管理遗产{'\n'}
                4. 继承涉及的税费和手续以当地规定为准
              </Text>
            </YStack>
          </XStack>
        </View>
      </ScrollView>
    </View>
  );
};

export default WillExecutionGuideScreen;
