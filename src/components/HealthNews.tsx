import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Button,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
} from 'tamagui';
import {
  BookOpen,
  Clock,
  Eye,
  ThumbsUp,
  Share,
  AlertTriangle,
  CheckCircle
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { COLORS } from '@/constants/app';

export const HealthNews: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: '全部', count: 156 },
    { id: 'prevention', name: '疾病预防', count: 45 },
    { id: 'nutrition', name: '营养健康', count: 38 },
    { id: 'exercise', name: '运动健身', count: 29 },
    { id: 'elderly', name: '老年健康', count: 24 },
    { id: 'mental', name: '心理健康', count: 20 },
  ];

  const newsArticles = [
    {
      id: 1,
      title: '冬季流感高发期，如何科学预防？',
      summary: '随着气温下降，流感病毒活跃度增加。专家提醒，做好个人防护，增强免疫力是关键...',
      author: '健康时报',
      publishTime: '2小时前',
      readTime: '3分钟',
      views: 1234,
      likes: 89,
      category: 'prevention',
      tags: ['流感预防', '冬季健康', '免疫力'],
      isVerified: true,
    },
    {
      id: 2,
      title: '老年人冬季饮食调理指南',
      summary: '冬季是老年人身体较为脆弱的季节，合理的饮食调理对维护健康至关重要...',
      author: '中医养生网',
      publishTime: '4小时前',
      readTime: '5分钟',
      views: 987,
      likes: 67,
      category: 'elderly',
      tags: ['老年饮食', '冬季养生', '营养调理'],
      isVerified: true,
    },
    {
      id: 3,
      title: '警惕！这些食物搭配可能有害健康',
      summary: '日常饮食中，一些看似普通的食物搭配可能对健康造成不良影响，需要特别注意...',
      author: '营养专家',
      publishTime: '6小时前',
      readTime: '4分钟',
      views: 2156,
      likes: 156,
      category: 'nutrition',
      tags: ['食物搭配', '营养安全', '健康饮食'],
      isVerified: false,
      isAlert: true,
    },
    {
      id: 4,
      title: '居家运动：适合冬季的室内健身方案',
      summary: '冬季户外运动受限，居家运动成为保持身体健康的重要方式。这里为您推荐几种简单有效的室内运动...',
      author: '健身教练协会',
      publishTime: '8小时前',
      readTime: '6分钟',
      views: 876,
      likes: 54,
      category: 'exercise',
      tags: ['居家运动', '冬季健身', '室内锻炼'],
      isVerified: true,
    },
    {
      id: 5,
      title: '心理健康：如何应对季节性情绪低落',
      summary: '冬季日照时间短，容易引起季节性情绪障碍。了解相关知识，学会自我调节很重要...',
      author: '心理健康中心',
      publishTime: '12小时前',
      readTime: '7分钟',
      views: 654,
      likes: 43,
      category: 'mental',
      tags: ['心理健康', '情绪调节', '季节性抑郁'],
      isVerified: true,
    },
  ];

  const filteredArticles = selectedCategory === 'all'
    ? newsArticles
    : newsArticles.filter((article) => article.category === selectedCategory);

  return (
    <Theme name="light">
      <YStack space="$4">
        {/* Category Filter */}
        <Card
          padding="$4"
          borderRadius="$4"
          backgroundColor="$cardBg"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2">
              {categories.map((category) => (
                <Pressable
                  key={category.id}
                  onPress={() => setSelectedCategory(category.id)}
                >
                  <View
                    backgroundColor={selectedCategory === category.id ? COLORS.primaryLight : 'transparent'}
                    borderColor="$borderColor"
                    borderWidth={selectedCategory === category.id ? 0 : 1}
                    borderRadius="$3"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                  >
                    <XStack space="$2" alignItems="center">
                      <Text
                        fontSize="$3"
                        color={selectedCategory === category.id ? 'white' : '$text'}
                      >
                        {category.name}
                      </Text>
                      <View
                        backgroundColor={selectedCategory === category.id ? 'rgba(255,255,255,0.2)' : '$surface'}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text
                          fontSize="$2"
                          color={selectedCategory === category.id ? 'white' : '$textSecondary'}
                        >
                          {category.count}
                        </Text>
                      </View>
                    </XStack>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>
        </Card>

        {/* News Articles */}
        <YStack space="$3">
          {filteredArticles.map((article) => (
            <Card
              key={article.id}
              padding="$4"
              borderRadius="$4"
              backgroundColor="$cardBg"
              shadowColor="$shadow"
              shadowOffset={{ width: 0, height: 2 }}
              shadowOpacity={0.1}
              shadowRadius={8}
              elevation={4}
              pressStyle={{ scale: 0.98 }}
            >
              <YStack space="$3">
                {/* Title with verification */}
                <XStack space="$2" alignItems="flex-start">
                  {article.isAlert && (
                    <AlertTriangle size={16} color={COLORS.warning} />
                  )}
                  <H3
                    fontSize="$5"
                    fontWeight="600"
                    color="$text"
                    flex={1}
                    lineHeight="$1"
                  >
                    {article.title}
                  </H3>
                  {article.isVerified && (
                    <CheckCircle size={16} color={COLORS.success} />
                  )}
                </XStack>

                {/* Summary */}
                <Text
                  fontSize="$3"
                  color="$textSecondary"
                  lineHeight="$1"
                  numberOfLines={2}
                >
                  {article.summary}
                </Text>

                {/* Author and time info */}
                <XStack space="$3" alignItems="center">
                  <Text fontSize="$3" color="$text" fontWeight="500">
                    {article.author}
                  </Text>
                  <XStack space="$1" alignItems="center">
                    <Clock size={12} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary">
                      {article.publishTime}
                    </Text>
                  </XStack>
                  <XStack space="$1" alignItems="center">
                    <BookOpen size={12} color={COLORS.textSecondary} />
                    <Text fontSize="$2" color="$textSecondary">
                      {article.readTime}
                    </Text>
                  </XStack>
                </XStack>

                {/* Tags */}
                <XStack flexWrap="wrap" gap="$2">
                  {article.tags.map((tag, index) => (
                    <View
                      key={index}
                      backgroundColor="$surface"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color="$primary">
                        {tag}
                      </Text>
                    </View>
                  ))}
                </XStack>

                {/* Stats and actions */}
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack space="$4" alignItems="center">
                    <XStack space="$1" alignItems="center">
                      <Eye size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {article.views}
                      </Text>
                    </XStack>
                    <XStack space="$1" alignItems="center">
                      <ThumbsUp size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {article.likes}
                      </Text>
                    </XStack>
                  </XStack>
                  <Button size="$3" chromeless>
                    <Share size={16} color={COLORS.textSecondary} />
                  </Button>
                </XStack>
              </YStack>
            </Card>
          ))}
        </YStack>

        {/* Load More */}
        <View alignItems="center">
          <Button
            size="$4"
            variant="outlined"
            borderColor="$borderColor"
            backgroundColor="transparent"
          >
            <Text fontSize="$3" color="$text">加载更多文章</Text>
          </Button>
        </View>
      </YStack>
    </Theme>
  );
};