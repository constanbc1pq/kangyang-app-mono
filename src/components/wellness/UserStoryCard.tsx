/**
 * 用户故事卡片组件
 * 展示真实用户案例，建立信任
 */

import React from 'react';
import { View, Text, YStack, Card } from 'tamagui';
import { ScrollView, Pressable } from 'react-native';
import { COLORS } from '@/constants/app';

export interface UserStory {
  id: string;
  name: string;
  age: number;
  avatar: string; // emoji or image
  role: string; // "退休教师" | "企业高管" | "独居老人" etc.
  problem: string; // 痛点描述
  solution: string; // 解决方案
  serviceCategory: string; // 服务类别
  targetScreen: string;
}

interface UserStoryCardProps {
  story: UserStory;
  onPress: (screen: string, params?: any) => void;
}

const UserStoryCardItem: React.FC<UserStoryCardProps> = ({ story, onPress }) => {
  return (
    <Pressable onPress={() => onPress(story.targetScreen, { storyId: story.id })}>
      <Card
        width={280}
        padding="$4"
        backgroundColor="$surface"
        bordered
        shadowColor="$shadow"
        shadowOffset={{ width: 0, height: 2 }}
        shadowOpacity={0.08}
        shadowRadius={4}
        elevation={2}
        marginRight={12}
      >
        <YStack space="$3">
          {/* 用户信息 */}
          <View
            flexDirection="row"
            alignItems="center"
            justifyContent="space-between"
          >
            <View flexDirection="row" alignItems="center" space="$2">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$background"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={24}>{story.avatar}</Text>
              </View>
              <YStack>
                <Text fontSize="$4" fontWeight="600" color="$text">
                  {story.name}
                </Text>
                <Text fontSize="$2" color="$textSecondary">
                  {story.age}岁 · {story.role}
                </Text>
              </YStack>
            </View>
            <View
              backgroundColor={`${COLORS.primary}15`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$2" color={COLORS.primary} fontWeight="600">
                {story.serviceCategory}
              </Text>
            </View>
          </View>

          {/* 痛点描述 */}
          <YStack space="$2">
            <Text fontSize="$2" color="$textSecondary">
              遇到的问题：
            </Text>
            <Text fontSize="$3" color="$text" lineHeight={20}>
              "{story.problem}"
            </Text>
          </YStack>

          {/* 解决方案 */}
          <YStack space="$2">
            <Text fontSize="$2" color={COLORS.success}>
              现在的改变：
            </Text>
            <Text fontSize="$3" color="$text" lineHeight={20}>
              "{story.solution}"
            </Text>
          </YStack>

          {/* 查看详情 */}
          <View
            paddingVertical="$2"
            borderTopWidth={1}
            borderTopColor="$borderColor"
            alignItems="center"
          >
            <Text fontSize="$3" color={COLORS.primary} fontWeight="600">
              查看完整故事 →
            </Text>
          </View>
        </YStack>
      </Card>
    </Pressable>
  );
};

interface UserStoryListProps {
  stories: UserStory[];
  onStoryPress: (screen: string, params?: any) => void;
}

export const UserStoryList: React.FC<UserStoryListProps> = ({
  stories,
  onStoryPress,
}) => {
  return (
    <View marginBottom={16}>
      <YStack space="$3">
        {/* 标题 */}
        <View paddingHorizontal="$4">
          <Text fontSize="$5" fontWeight="600" color="$text">
            和您一样的选择
          </Text>
          <Text fontSize="$3" color="$textSecondary" marginTop="$1">
            看看他们如何改善生活品质
          </Text>
        </View>

        {/* 横向滚动列表 */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 4 }}
        >
          {stories.map((story) => (
            <UserStoryCardItem key={story.id} story={story} onPress={onStoryPress} />
          ))}
        </ScrollView>
      </YStack>
    </View>
  );
};

/**
 * Mock用户故事数据
 */
export const mockUserStories: UserStory[] = [
  {
    id: 'story_001',
    name: '李阿姨',
    age: 68,
    avatar: '👵',
    role: '退休教师',
    problem: '儿女在外地工作，一个人做饭很麻烦，经常随便吃点，营养跟不上',
    solution: '现在每天都有营养师定制的三餐送到家，方便又健康，体重和血压都稳定了',
    serviceCategory: '送餐上门',
    targetScreen: 'DeliveryService',
  },
  {
    id: 'story_002',
    name: '王先生',
    age: 55,
    avatar: '👨',
    role: '企业高管',
    problem: '工作压力大，经常应酬，体检发现血糖偏高，担心发展成糖尿病',
    solution: '私人医生帮我制定了饮食和运动方案，定期监测血糖，现在指标恢复正常了',
    serviceCategory: '私人医生',
    targetScreen: 'PrivateDoctorList',
  },
  {
    id: 'story_003',
    name: '张大爷',
    age: 72,
    avatar: '👴',
    role: '退休工人',
    problem: '腿脚不便，出门不方便，想咨询遗嘱的事情不知道找谁',
    solution: '律师直接上门服务，耐心解答所有问题，帮我把遗嘱都办好了，心里踏实了',
    serviceCategory: '法律咨询',
    targetScreen: 'LegalServiceHome',
  },
  {
    id: 'story_004',
    name: '刘女士',
    age: 48,
    avatar: '👩',
    role: '公司职员',
    problem: '想给父母买保险，产品太多不知道怎么选，担心买错了',
    solution: 'AI帮我分析了父母的保障缺口，顾问推荐了适合的产品，还帮忙对比了价格',
    serviceCategory: '保险规划',
    targetScreen: 'InsuranceHome',
  },
  {
    id: 'story_005',
    name: '陈阿姨',
    age: 65,
    avatar: '👵',
    role: '退休干部',
    problem: '一直有高血压，需要调整饮食，但不知道怎么吃才健康',
    solution: '营养师给我定制了降压食谱，每周都有新菜式，现在血压控制得很好',
    serviceCategory: '营养配餐',
    targetScreen: 'NutritionService',
  },
  {
    id: 'story_006',
    name: '赵先生',
    age: 58,
    avatar: '👨',
    role: '企业主',
    problem: '父母年纪大了需要专业护理，但不想送养老院',
    solution: '居家养老服务很专业，护理人员每天上门，父母在家就能享受专业照顾',
    serviceCategory: '养老服务',
    targetScreen: 'ElderlyService',
  },
];
