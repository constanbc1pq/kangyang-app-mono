import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
} from 'tamagui';
import { SafeAreaView, FlatList, RefreshControl, TouchableOpacity, Alert } from 'react-native';
import { ArrowLeft, MessageCircle, Pin } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { ChatConversation } from '@/types/community';
import {
  getConversations,
  initializeCommunityData,
  togglePinConversation,
  deleteConversation,
} from '@/services/communityDataService';
import { useFocusEffect } from '@react-navigation/native';

interface ChatListScreenProps {
  navigation: any;
}

/**
 * 聊天列表页
 * 展示所有对话列表
 */
export const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // 初始化时加载数据
  useEffect(() => {
    loadInitialData();
  }, []);

  // 页面聚焦时重新加载数据
  useFocusEffect(
    useCallback(() => {
      loadConversations();
    }, [])
  );

  const loadInitialData = async () => {
    try {
      // 确保社区数据已初始化
      await initializeCommunityData();
      await loadConversations();
    } catch (error) {
      console.error('初始化数据失败:', error);
    }
  };

  const loadConversations = async () => {
    try {
      setLoading(true);
      const conversationsData = await getConversations();
      setConversations(conversationsData);
    } catch (error) {
      console.error('加载对话列表失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadConversations();
    setRefreshing(false);
  };

  const handleConversationPress = (conversationId: string) => {
    navigation.navigate('Chat', { conversationId });
  };

  const handleConversationLongPress = (conversation: ChatConversation) => {
    const options = [
      {
        text: conversation.isPinned ? '取消置顶' : '置顶',
        onPress: () => handleTogglePin(conversation.id),
      },
      {
        text: '删除对话',
        onPress: () => handleDeleteConversation(conversation.id),
        style: 'destructive' as const,
      },
      {
        text: '取消',
        style: 'cancel' as const,
      },
    ];

    Alert.alert('对话操作', '请选择操作', options);
  };

  const handleTogglePin = async (conversationId: string) => {
    try {
      const isPinned = await togglePinConversation(conversationId);
      Alert.alert('成功', isPinned ? '已置顶对话' : '已取消置顶');
      await loadConversations();
    } catch (error) {
      console.error('切换置顶状态失败:', error);
      Alert.alert('失败', '操作失败，请稍后重试');
    }
  };

  const handleDeleteConversation = async (conversationId: string) => {
    Alert.alert(
      '确认删除',
      '删除后将无法恢复，确定要删除这个对话吗？',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            try {
              const success = await deleteConversation(conversationId);
              if (success) {
                Alert.alert('成功', '对话已删除');
                await loadConversations();
              } else {
                Alert.alert('失败', '删除失败，请稍后重试');
              }
            } catch (error) {
              console.error('删除对话失败:', error);
              Alert.alert('失败', '删除失败，请稍后重试');
            }
          },
        },
      ]
    );
  };

  const handleBack = () => {
    navigation.goBack();
  };

  // 格式化最后消息时间
  const formatLastMessageTime = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
      // 今天，显示时间
      const hours = date.getHours().toString().padStart(2, '0');
      const minutes = date.getMinutes().toString().padStart(2, '0');
      return `${hours}:${minutes}`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      const weekdays = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];
      return weekdays[date.getDay()];
    } else {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    }
  };

  // 获取对话类型标签
  const getConversationTypeLabel = (type: string): string => {
    const labels: { [key: string]: string } = {
      job: '服务',
      secondhand: '二手',
      expert: '达人',
    };
    return labels[type] || '';
  };

  const renderEmpty = () => {
    if (loading) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
          <Text fontSize="$4" color="$textSecondary">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <MessageCircle size={64} color={COLORS.textSecondary} strokeWidth={1} />
        <Text fontSize="$5" fontWeight="600" color="$text" marginTop="$4" marginBottom="$2">
          暂无消息
        </Text>
        <Text fontSize="$3" color="$textSecondary" textAlign="center">
          您的聊天消息将显示在这里
        </Text>
      </View>
    );
  };

  const renderConversationItem = ({ item }: { item: ChatConversation }) => {
    return (
      <TouchableOpacity
        onPress={() => handleConversationPress(item.id)}
        onLongPress={() => handleConversationLongPress(item)}
      >
        <View
          backgroundColor={item.isPinned ? `${COLORS.primary}05` : 'white'}
          paddingHorizontal="$4"
          paddingVertical="$3"
          borderBottomWidth={1}
          borderBottomColor="$borderColor"
        >
          <XStack space="$3" alignItems="center">
            {/* 头像 */}
            <View position="relative">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$background"
                justifyContent="center"
                alignItems="center"
              >
                <Text fontSize={24}>👤</Text>
              </View>

              {/* 未读消息角标 */}
              {item.unreadCount > 0 && (
                <View
                  position="absolute"
                  top={-4}
                  right={-4}
                  minWidth={20}
                  height={20}
                  borderRadius={10}
                  backgroundColor={COLORS.error}
                  justifyContent="center"
                  alignItems="center"
                  paddingHorizontal="$1"
                >
                  <Text fontSize="$1" color="white" fontWeight="600">
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>

            {/* 对话信息 */}
            <YStack flex={1} space="$1">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack space="$2" alignItems="center" flex={1}>
                  {item.isPinned && (
                    <Pin size={14} color={COLORS.primary} fill={COLORS.primary} />
                  )}
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color="$text"
                    numberOfLines={1}
                  >
                    {item.type === 'job' ? '服务需求对话' :
                     item.type === 'secondhand' ? '闲置物品对话' :
                     item.type === 'expert' ? '达人咨询对话' : '对话'}
                  </Text>
                  {item.type && (
                    <View
                      backgroundColor={`${COLORS.primary}20`}
                      paddingHorizontal="$2"
                      paddingVertical="$0.5"
                      borderRadius="$2"
                    >
                      <Text fontSize="$1" color={COLORS.primary} fontWeight="600">
                        {getConversationTypeLabel(item.type)}
                      </Text>
                    </View>
                  )}
                </XStack>

                <Text fontSize="$2" color="$textSecondary">
                  {formatLastMessageTime(item.lastMessageAt)}
                </Text>
              </XStack>

              <Text
                fontSize="$3"
                color={item.unreadCount > 0 ? '$text' : '$textSecondary'}
                fontWeight={item.unreadCount > 0 ? '600' : '400'}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </YStack>
          </XStack>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.background }}>
      {/* 顶部导航栏 */}
      <View
        backgroundColor="white"
        paddingTop="$3"
        paddingHorizontal="$4"
        paddingBottom="$3"
        borderBottomWidth={1}
        borderBottomColor="$borderColor"
      >
        <XStack space="$3" alignItems="center">
          <TouchableOpacity onPress={handleBack}>
            <View
              width={32}
              height={32}
              justifyContent="center"
              alignItems="center"
            >
              <ArrowLeft size={24} color={COLORS.text} />
            </View>
          </TouchableOpacity>

          <YStack flex={1}>
            <Text fontSize="$6" fontWeight="bold" color="$text">
              消息
            </Text>
            <Text fontSize="$3" color="$textSecondary">
              {conversations.length > 0 ? `${conversations.length} 个对话` : '暂无对话'}
            </Text>
          </YStack>
        </XStack>
      </View>

      {/* 对话列表 */}
      <FlatList
        data={conversations}
        renderItem={renderConversationItem}
        keyExtractor={item => item.id}
        ListEmptyComponent={renderEmpty}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        showsVerticalScrollIndicator={false}
      />
    </SafeAreaView>
  );
};
