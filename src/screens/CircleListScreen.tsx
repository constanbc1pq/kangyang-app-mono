import React, { useState } from 'react';
import {
  YStack,
  XStack,
  Text,
  Card,
  View,
  H3,
  Theme,
  ScrollView,
  Input,
  Button,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Pressable, ActivityIndicator } from 'react-native';
import {
  ArrowLeft,
  Search,
  Users,
  MessageCircle,
  CheckCircle,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { Circle } from '@/types/community';
import { circleService } from '@/services/circleService';
import { useFocusEffect } from '@react-navigation/native';

interface CircleListScreenProps {
  navigation: any;
}

export const CircleListScreen: React.FC<CircleListScreenProps> = ({ navigation }) => {
  const [circles, setCircles] = useState<Circle[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [showMyCircles, setShowMyCircles] = useState(false);

  const categories = ['全部', '疾病管理', '养生交流', '运动健身'];

  const loadCircles = async () => {
    setLoading(true);
    if (showMyCircles) {
      const data = await circleService.getMyCircles();
      setCircles(data);
    } else if (searchQuery) {
      const results = await circleService.searchCircles(searchQuery);
      setCircles(results);
    } else {
      const data = await circleService.getCirclesByCategory(selectedCategory);
      setCircles(data);
    }
    setLoading(false);
  };

  useFocusEffect(
    React.useCallback(() => {
      loadCircles();
    }, [selectedCategory, searchQuery, showMyCircles])
  );

  const handleCirclePress = (circleId: string) => {
    navigation.navigate('CircleDetail', { circleId });
  };

  const handleJoin = async (circleId: string, e: any) => {
    e.stopPropagation();
    const newState = await circleService.toggleJoinCircle(circleId);
    setCircles(circles.map(circle =>
      circle.id === circleId
        ? {
            ...circle,
            isJoined: newState,
            members: newState ? circle.members + 1 : circle.members - 1,
          }
        : circle
    ));
  };

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1, backgroundColor: '$background' }}>
        {/* Header */}
        <XStack
          height={56}
          alignItems="center"
          paddingHorizontal="$4"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
          backgroundColor="$background"
        >
          <Pressable onPress={() => navigation.goBack()}>
            <XStack space="$2" alignItems="center">
              <ArrowLeft size={24} color={COLORS.text} />
              <Text fontSize="$5" color="$text" fontWeight="600">
                健康圈子
              </Text>
            </XStack>
          </Pressable>
        </XStack>

        <YStack flex={1}>
          {/* 搜索栏 */}
          <View padding="$4" paddingBottom="$3">
            <XStack
              borderWidth={1}
              borderColor="$borderColor"
              borderRadius="$3"
              backgroundColor="$surface"
              alignItems="center"
              paddingHorizontal="$3"
              paddingVertical="$2"
            >
              <Search size={16} color={COLORS.textSecondary} />
              <Input
                flex={1}
                borderWidth={0}
                backgroundColor="transparent"
                placeholder="搜索圈子..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                marginLeft="$2"
              />
            </XStack>
          </View>

          {/* Tab切换 */}
          <XStack paddingHorizontal="$4" paddingBottom="$3" space="$2">
            <Pressable onPress={() => setShowMyCircles(false)} style={{ flex: 1 }}>
              <View
                backgroundColor={!showMyCircles ? COLORS.primary : '$surface'}
                paddingVertical="$2"
                borderRadius="$3"
                borderWidth={1}
                borderColor={!showMyCircles ? COLORS.primary : '$borderColor'}
              >
                <Text
                  fontSize="$3"
                  color={!showMyCircles ? 'white' : '$text'}
                  fontWeight={!showMyCircles ? '600' : '400'}
                  textAlign="center"
                >
                  发现圈子
                </Text>
              </View>
            </Pressable>
            <Pressable onPress={() => setShowMyCircles(true)} style={{ flex: 1 }}>
              <View
                backgroundColor={showMyCircles ? COLORS.primary : '$surface'}
                paddingVertical="$2"
                borderRadius="$3"
                borderWidth={1}
                borderColor={showMyCircles ? COLORS.primary : '$borderColor'}
              >
                <Text
                  fontSize="$3"
                  color={showMyCircles ? 'white' : '$text'}
                  fontWeight={showMyCircles ? '600' : '400'}
                  textAlign="center"
                >
                  我的圈子
                </Text>
              </View>
            </Pressable>
          </XStack>

          {/* 分类筛选 */}
          {!showMyCircles && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              paddingHorizontal="$4"
              paddingBottom="$3"
            >
              <XStack space="$2">
                {categories.map((category) => (
                  <Pressable key={category} onPress={() => setSelectedCategory(category)}>
                    <View
                      backgroundColor={
                        selectedCategory === category ? COLORS.primary : '$surface'
                      }
                      paddingHorizontal="$4"
                      paddingVertical="$2"
                      borderRadius="$3"
                      borderWidth={1}
                      borderColor={
                        selectedCategory === category ? COLORS.primary : '$borderColor'
                      }
                    >
                      <Text
                        fontSize="$3"
                        color={selectedCategory === category ? 'white' : '$text'}
                        fontWeight={selectedCategory === category ? '600' : '400'}
                      >
                        {category}
                      </Text>
                    </View>
                  </Pressable>
                ))}
              </XStack>
            </ScrollView>
          )}

          {/* 圈子列表 */}
          {loading ? (
            <View flex={1} justifyContent="center" alignItems="center">
              <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
          ) : circles.length === 0 ? (
            <View flex={1} justifyContent="center" alignItems="center" padding="$4">
              <Users size={48} color={COLORS.textSecondary} />
              <Text fontSize="$4" color="$textSecondary" marginTop="$2">
                {showMyCircles ? '暂未加入任何圈子' : '暂无圈子'}
              </Text>
            </View>
          ) : (
            <ScrollView flex={1} showsVerticalScrollIndicator={false}>
              <YStack padding="$4" paddingTop="$2" space="$3">
                {circles.map((circle) => (
                  <Pressable key={circle.id} onPress={() => handleCirclePress(circle.id)}>
                    <Card
                      padding="$4"
                      borderRadius="$4"
                      backgroundColor="$cardBg"
                      shadowColor="$shadow"
                      shadowOffset={{ width: 0, height: 1 }}
                      shadowOpacity={0.1}
                      shadowRadius={4}
                      elevation={2}
                      pressStyle={{ scale: 0.98 }}
                    >
                      <YStack space="$3">
                        {/* 圈子头部 */}
                        <XStack space="$3" alignItems="flex-start">
                          <View
                            width={56}
                            height={56}
                            borderRadius={28}
                            backgroundColor="$surface"
                            justifyContent="center"
                            alignItems="center"
                          >
                            <Users size={28} color={COLORS.primary} />
                          </View>
                          <YStack flex={1} space="$2">
                            <XStack space="$2" alignItems="center">
                              <H3 fontSize="$5" fontWeight="600" color="$text">
                                {circle.name}
                              </H3>
                              {circle.isVerified && (
                                <CheckCircle size={16} color={COLORS.primary} />
                              )}
                            </XStack>
                            <Text
                              fontSize="$3"
                              color="$textSecondary"
                              numberOfLines={2}
                              lineHeight="$2"
                            >
                              {circle.description}
                            </Text>
                          </YStack>
                        </XStack>

                        {/* 统计信息 */}
                        <XStack space="$4">
                          <XStack space="$1" alignItems="center">
                            <Users size={14} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$textSecondary">
                              {circle.members} 成员
                            </Text>
                          </XStack>
                          <XStack space="$1" alignItems="center">
                            <MessageCircle size={14} color={COLORS.textSecondary} />
                            <Text fontSize="$3" color="$textSecondary">
                              {circle.posts} 帖子
                            </Text>
                          </XStack>
                          <Text fontSize="$3" color="$textSecondary">
                            今日 {circle.todayPosts} 条新帖
                          </Text>
                        </XStack>

                        {/* 标签 */}
                        <XStack flexWrap="wrap" gap="$2">
                          {circle.tags.slice(0, 4).map((tag, index) => (
                            <View
                              key={index}
                              backgroundColor="rgba(99, 102, 241, 0.1)"
                              paddingHorizontal="$2"
                              paddingVertical="$1"
                              borderRadius="$2"
                            >
                              <Text fontSize="$2" color="$primary">
                                #{tag}
                              </Text>
                            </View>
                          ))}
                        </XStack>

                        {/* 加入按钮 */}
                        <Button
                          size="$3"
                          backgroundColor={circle.isJoined ? '$surface' : '$primary'}
                          onPress={(e) => handleJoin(circle.id, e)}
                          borderWidth={circle.isJoined ? 1 : 0}
                          borderColor="$borderColor"
                        >
                          <Text
                            fontSize="$3"
                            color={circle.isJoined ? '$text' : 'white'}
                            fontWeight="600"
                          >
                            {circle.isJoined ? '已加入' : '加入圈子'}
                          </Text>
                        </Button>
                      </YStack>
                    </Card>
                  </Pressable>
                ))}

                <View height={20} />
              </YStack>
            </ScrollView>
          )}
        </YStack>
      </SafeAreaView>
    </Theme>
  );
};
