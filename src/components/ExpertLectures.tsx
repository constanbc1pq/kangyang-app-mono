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
  Play,
  Calendar,
  Users,
  Star,
  Clock,
  BookOpen,
  Radio
} from 'lucide-react-native';
import { Pressable } from 'react-native';
import { COLORS } from '@/constants/app';

export const ExpertLectures: React.FC = () => {
  const [selectedType, setSelectedType] = useState('all');

  const lectureTypes = [
    { id: 'all', name: '全部', count: 48 },
    { id: 'live', name: '直播课程', count: 12 },
    { id: 'video', name: '视频课程', count: 28 },
    { id: 'consultation', name: '付费咨询', count: 8 },
  ];

  const lectures = [
    {
      id: 1,
      title: '冬季养生：中医调理与现代保健',
      expert: '张明华',
      expertTitle: '主任医师，中医养生专家',
      hospital: '北京中医医院',
      type: 'live',
      status: 'upcoming',
      startTime: '今晚 20:00',
      duration: '60分钟',
      viewers: 1234,
      rating: 4.9,
      price: '免费',
      description: '结合传统中医理论与现代医学，为您详解冬季养生的科学方法...',
      tags: ['中医养生', '冬季保健', '免费直播'],
    },
    {
      id: 2,
      title: '老年人慢病管理实用指南',
      expert: '李慧敏',
      expertTitle: '副主任医师，老年医学专家',
      hospital: '协和医院老年科',
      type: 'video',
      status: 'available',
      duration: '45分钟',
      viewers: 2156,
      rating: 4.8,
      price: '￥29',
      description: '针对老年人常见慢性疾病，提供系统性的管理方案和日常护理建议...',
      tags: ['老年医学', '慢病管理', '付费课程'],
    },
    {
      id: 3,
      title: '营养师一对一咨询服务',
      expert: '王雅琴',
      expertTitle: '注册营养师，临床营养专家',
      hospital: '营养健康中心',
      type: 'consultation',
      status: 'available',
      duration: '30分钟',
      consultations: 156,
      rating: 4.9,
      price: '￥199',
      description: '个性化营养评估，定制专属饮食方案，解答您的营养健康疑问...',
      tags: ['营养咨询', '个性化服务', '一对一'],
    },
    {
      id: 4,
      title: '心理健康：压力管理与情绪调节',
      expert: '陈志强',
      expertTitle: '心理咨询师，精神科医师',
      hospital: '心理健康中心',
      type: 'video',
      status: 'available',
      duration: '38分钟',
      viewers: 987,
      rating: 4.7,
      price: '￥19',
      description: '学会识别压力信号，掌握科学的情绪调节方法，提升心理健康水平...',
      tags: ['心理健康', '压力管理', '情绪调节'],
    },
    {
      id: 5,
      title: '家庭急救知识与技能培训',
      expert: '刘建国',
      expertTitle: '急诊科主任，急救培训专家',
      hospital: '市人民医院急诊科',
      type: 'live',
      status: 'upcoming',
      startTime: '明天 19:30',
      duration: '90分钟',
      viewers: 567,
      rating: 4.8,
      price: '￥39',
      description: '掌握基本急救技能，关键时刻能够自救互救，保护家人健康安全...',
      tags: ['急救培训', '家庭安全', '实用技能'],
    },
  ];

  const filteredLectures = selectedType === 'all'
    ? lectures
    : lectures.filter((lecture) => lecture.type === selectedType);

  const getStatusBadge = (type: string, status: string) => {
    if (type === 'live') {
      if (status === 'upcoming') {
        return (
          <View
            backgroundColor={COLORS.error}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <XStack space="$1" alignItems="center">
              <Radio size={12} color="white" />
              <Text fontSize="$2" color="white">即将开播</Text>
            </XStack>
          </View>
        );
      } else {
        return (
          <View
            backgroundColor={COLORS.success}
            paddingHorizontal="$2"
            paddingVertical="$1"
            borderRadius="$2"
          >
            <XStack space="$1" alignItems="center">
              <Radio size={12} color="white" />
              <Text fontSize="$2" color="white">直播中</Text>
            </XStack>
          </View>
        );
      }
    }
    return null;
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'live':
        return <Radio size={16} color={COLORS.primary} />;
      case 'video':
        return <Play size={16} color={COLORS.primary} />;
      case 'consultation':
        return <Users size={16} color={COLORS.primary} />;
      default:
        return <BookOpen size={16} color={COLORS.primary} />;
    }
  };

  return (
    <Theme name="light">
      <YStack space="$4">
        {/* Type Filter */}
        <Card
          padding="$4"
          borderRadius="$4"
          backgroundColor="$cardBg"
          borderWidth={1}
          borderColor="$borderColor"
        >
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <XStack space="$2">
              {lectureTypes.map((type) => (
                <Pressable
                  key={type.id}
                  onPress={() => setSelectedType(type.id)}
                >
                  <View
                    backgroundColor={selectedType === type.id ? COLORS.primaryLight : 'transparent'}
                    borderColor="$borderColor"
                    borderWidth={selectedType === type.id ? 0 : 1}
                    borderRadius="$3"
                    paddingHorizontal="$3"
                    paddingVertical="$2"
                  >
                    <XStack space="$2" alignItems="center">
                      {getTypeIcon(type.id)}
                      <Text
                        fontSize="$3"
                        color={selectedType === type.id ? 'white' : '$text'}
                      >
                        {type.name}
                      </Text>
                      <View
                        backgroundColor={selectedType === type.id ? 'rgba(255,255,255,0.2)' : '$surface'}
                        paddingHorizontal="$2"
                        paddingVertical="$1"
                        borderRadius="$2"
                      >
                        <Text
                          fontSize="$2"
                          color={selectedType === type.id ? 'white' : '$textSecondary'}
                        >
                          {type.count}
                        </Text>
                      </View>
                    </XStack>
                  </View>
                </Pressable>
              ))}
            </XStack>
          </ScrollView>
        </Card>

        {/* Lectures */}
        <YStack space="$4">
          {filteredLectures.map((lecture) => (
            <Card
              key={lecture.id}
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
              <YStack space="$4">
                {/* Header with status */}
                <XStack justifyContent="space-between" alignItems="flex-start">
                  <YStack flex={1} marginRight="$3">
                    <H3 fontSize="$5" fontWeight="600" color="$text" marginBottom="$2">
                      {lecture.title}
                    </H3>
                    <Text fontSize="$3" color="$textSecondary" lineHeight="$1" numberOfLines={2}>
                      {lecture.description}
                    </Text>
                  </YStack>
                  <XStack space="$2" alignItems="center">
                    {getStatusBadge(lecture.type, lecture.status)}
                    <View
                      backgroundColor="rgba(0,0,0,0.1)"
                      paddingHorizontal="$2"
                      paddingVertical="$1"
                      borderRadius="$2"
                    >
                      <Text fontSize="$2" color="$text" fontWeight="600">
                        {lecture.price}
                      </Text>
                    </View>
                  </XStack>
                </XStack>

                {/* Expert Info */}
                <XStack space="$3" alignItems="center">
                  <View
                    width={40}
                    height={40}
                    backgroundColor="$surface"
                    borderRadius={20}
                    justifyContent="center"
                    alignItems="center"
                  >
                    <Users size={20} color={COLORS.textSecondary} />
                  </View>
                  <YStack flex={1}>
                    <Text fontSize="$4" fontWeight="600" color="$text">
                      {lecture.expert}
                    </Text>
                    <Text fontSize="$3" color="$textSecondary">
                      {lecture.expertTitle}
                    </Text>
                    <Text fontSize="$2" color="$textSecondary">
                      {lecture.hospital}
                    </Text>
                  </YStack>
                </XStack>

                {/* Course Details */}
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack space="$4" alignItems="center">
                    {lecture.startTime && (
                      <XStack space="$1" alignItems="center">
                        <Calendar size={14} color={COLORS.textSecondary} />
                        <Text fontSize="$3" color="$textSecondary">
                          {lecture.startTime}
                        </Text>
                      </XStack>
                    )}
                    <XStack space="$1" alignItems="center">
                      <Clock size={14} color={COLORS.textSecondary} />
                      <Text fontSize="$3" color="$textSecondary">
                        {lecture.duration}
                      </Text>
                    </XStack>
                  </XStack>
                  <XStack space="$1" alignItems="center">
                    <Star size={14} color={COLORS.warning} />
                    <Text fontSize="$3" color="$textSecondary">
                      {lecture.rating}
                    </Text>
                  </XStack>
                </XStack>

                {/* Tags and Stats */}
                <XStack justifyContent="space-between" alignItems="center">
                  <XStack flexWrap="wrap" gap="$2" flex={1} marginRight="$3">
                    {lecture.tags.map((tag, index) => (
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
                  <Text fontSize="$3" color="$textSecondary">
                    {lecture.viewers && `${lecture.viewers} 人观看`}
                    {lecture.consultations && `${lecture.consultations} 次咨询`}
                  </Text>
                </XStack>

                {/* Action Button */}
                <Button backgroundColor="$primary" size="$4">
                  <Text fontSize="$3" color="white" fontWeight="600">
                    {lecture.type === 'live' && lecture.status === 'upcoming' && '预约直播'}
                    {lecture.type === 'live' && lecture.status === 'live' && '进入直播间'}
                    {lecture.type === 'video' && '立即观看'}
                    {lecture.type === 'consultation' && '预约咨询'}
                  </Text>
                </Button>
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
            <Text fontSize="$3" color="$text">查看更多课程</Text>
          </Button>
        </View>
      </YStack>
    </Theme>
  );
};