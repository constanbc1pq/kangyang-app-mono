/**
 * ChatListScreen 消息中心
 * 展示所有对话列表，支持分类筛选
 * 遵循 Tamagui 和 CLAUDE.md 页面布局配色规范
 */
import React, { useState, useEffect, useCallback } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  ScrollView,
  useTheme,
} from 'tamagui';
import {
  FlatList,
  RefreshControl,
  Pressable,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  MessageCircle,
  Pin,
  Briefcase,
  Package,
  Award,
  Bell,
} from 'lucide-react-native';
import { TitleBar } from '@/components/TitleBar';
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

// 消息分类类型
type MessageCategory = 'all' | 'job' | 'secondhand' | 'expert' | 'system';

/**
 * 消息中心页面
 */
export const ChatListScreen: React.FC<ChatListScreenProps> = ({ navigation }) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const primaryColor = theme.primary?.val;
  const successColor = theme.success?.val;
  const warningColor = theme.warning?.val;
  const errorColor = theme.error?.val;
  const color10 = theme.color10?.val;

  const [conversations, setConversations] = useState<ChatConversation[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeCategory, setActiveCategory] = useState<MessageCategory>('all');

  // 消息分类配置
  const categories = [
    { key: 'all' as const, label: '全部', icon: MessageCircle },
    { key: 'job' as const, label: '服务', icon: Briefcase },
    { key: 'secondhand' as const, label: '闲置', icon: Package },
    { key: 'expert' as const, label: '达人', icon: Award },
    { key: 'system' as const, label: '系统', icon: Bell },
  ];

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

  const handleConversationPress = (conversation: ChatConversation) => {
    const currentUserId = 'current-user-id';
    const recipientName = conversation.participant1Id === currentUserId
      ? conversation.participant2Name
      : conversation.participant1Name;
    const recipientAvatar = conversation.participant1Id === currentUserId
      ? conversation.participant2Avatar
      : conversation.participant1Avatar;
    const recipientId = conversation.participant1Id === currentUserId
      ? conversation.participant2Id
      : conversation.participant1Id;

    navigation.navigate('Chat', {
      conversationId: conversation.id,
      expertName: recipientName,
      expertAvatar: recipientAvatar,
      expertId: recipientId,
    });
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

  // 格式化最后消息时间
  const formatLastMessageTime = (date: Date): string => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const messageDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());

    const diffDays = Math.floor((today.getTime() - messageDate.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
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
      secondhand: '闲置',
      expert: '达人',
      system: '系统',
    };
    return labels[type] || '';
  };

  // 获取对话类型颜色
  const getConversationTypeColor = (type: string): string | undefined => {
    switch (type) {
      case 'job':
        return primaryColor;
      case 'secondhand':
        return successColor;
      case 'expert':
        return warningColor;
      case 'system':
        return color10;
      default:
        return color10;
    }
  };

  // 过滤对话列表
  const filteredConversations = activeCategory === 'all'
    ? conversations
    : conversations.filter(c => c.type === activeCategory);

  // 计算各分类未读数
  const getUnreadCount = (category: MessageCategory): number => {
    if (category === 'all') {
      return conversations.reduce((sum, c) => sum + c.unreadCount, 0);
    }
    return conversations
      .filter(c => c.type === category)
      .reduce((sum, c) => sum + c.unreadCount, 0);
  };

  // 渲染分类标签栏
  const renderCategoryTabs = () => (
    <View
      backgroundColor="$color2"
      borderBottomWidth={1}
      borderBottomColor="$color5"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10 }}
      >
        <XStack gap="$2" paddingVertical="$2">
          {categories.map(category => {
            const unreadCount = getUnreadCount(category.key);
            const isActive = activeCategory === category.key;
            const IconComponent = category.icon;

            return (
              <Pressable
                key={category.key}
                onPress={() => setActiveCategory(category.key)}
              >
                <View
                  backgroundColor={isActive ? primaryColor : '$color4'}
                  paddingHorizontal="$3"
                  paddingVertical="$2"
                  borderRadius="$10"
                  borderWidth={1}
                  borderColor={isActive ? primaryColor : '$color5'}
                  position="relative"
                >
                  <XStack gap="$1.5" alignItems="center">
                    <IconComponent
                      size={14}
                      color={isActive ? 'white' : color10}
                    />
                    <Text
                      fontSize="$3"
                      color={isActive ? 'white' : '$color12'}
                      fontWeight={isActive ? '600' : '400'}
                    >
                      {category.label}
                    </Text>
                  </XStack>

                  {/* 未读红点 */}
                  {unreadCount > 0 && (
                    <View
                      position="absolute"
                      top={-4}
                      right={-4}
                      minWidth={16}
                      height={16}
                      borderRadius={8}
                      backgroundColor={errorColor}
                      justifyContent="center"
                      alignItems="center"
                      paddingHorizontal={4}
                    >
                      <Text fontSize={10} color="white" fontWeight="600">
                        {unreadCount > 99 ? '99+' : unreadCount}
                      </Text>
                    </View>
                  )}
                </View>
              </Pressable>
            );
          })}
        </XStack>
      </ScrollView>
    </View>
  );

  // 渲染空状态
  const renderEmpty = () => {
    if (loading) {
      return (
        <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
          <Text fontSize="$4" color="$color10">
            加载中...
          </Text>
        </View>
      );
    }

    return (
      <View flex={1} justifyContent="center" alignItems="center" paddingVertical="$8">
        <MessageCircle size={64} color={color10} strokeWidth={1} />
        <Text fontSize="$4" fontWeight="600" color="$color12" marginTop="$4" marginBottom="$1.5">
          暂无消息
        </Text>
        <Text fontSize="$3" color="$color10" textAlign="center">
          {activeCategory === 'all'
            ? '您的聊天消息将显示在这里'
            : `暂无${getConversationTypeLabel(activeCategory)}类消息`
          }
        </Text>
      </View>
    );
  };

  // 渲染对话项
  const renderConversationItem = ({ item }: { item: ChatConversation }) => {
    const typeColor = getConversationTypeColor(item.type);

    return (
      <Pressable
        onPress={() => handleConversationPress(item)}
        onLongPress={() => handleConversationLongPress(item)}
      >
        <View
          backgroundColor={item.isPinned ? `${primaryColor}05` : '$color2'}
          paddingHorizontal="$2.5"
          paddingVertical="$2"
          borderBottomWidth={1}
          borderBottomColor="$color5"
        >
          <XStack gap="$2" alignItems="center">
            {/* 头像 */}
            <View position="relative">
              <View
                width={48}
                height={48}
                borderRadius={24}
                backgroundColor="$color4"
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
                  minWidth={18}
                  height={18}
                  borderRadius={9}
                  backgroundColor={errorColor}
                  justifyContent="center"
                  alignItems="center"
                  paddingHorizontal={4}
                >
                  <Text fontSize={10} color="white" fontWeight="600">
                    {item.unreadCount > 99 ? '99+' : item.unreadCount}
                  </Text>
                </View>
              )}
            </View>

            {/* 对话信息 */}
            <YStack flex={1} gap="$1">
              <XStack justifyContent="space-between" alignItems="center">
                <XStack gap="$1.5" alignItems="center" flex={1}>
                  {item.isPinned && (
                    <Pin size={12} color={primaryColor} fill={primaryColor} />
                  )}
                  <Text
                    fontSize="$4"
                    fontWeight="600"
                    color="$color12"
                    numberOfLines={1}
                    flex={1}
                  >
                    {item.type === 'job' ? '服务需求对话' :
                     item.type === 'secondhand' ? '闲置物品对话' :
                     item.type === 'expert' ? '达人咨询对话' :
                     item.type === 'system' ? '系统通知' : '对话'}
                  </Text>
                  {item.type && (
                    <View
                      backgroundColor={`${typeColor}15`}
                      paddingHorizontal="$1.5"
                      paddingVertical="$0.5"
                      borderRadius="$4"
                    >
                      <Text fontSize={10} color={typeColor} fontWeight="600">
                        {getConversationTypeLabel(item.type)}
                      </Text>
                    </View>
                  )}
                </XStack>

                <Text fontSize="$2" color="$color10" marginLeft="$2">
                  {formatLastMessageTime(item.lastMessageAt)}
                </Text>
              </XStack>

              <Text
                fontSize="$3"
                color={item.unreadCount > 0 ? '$color12' : '$color10'}
                fontWeight={item.unreadCount > 0 ? '500' : '400'}
                numberOfLines={1}
              >
                {item.lastMessage}
              </Text>
            </YStack>
          </XStack>
        </View>
      </Pressable>
    );
  };

  return (
    <View flex={1} backgroundColor="$background">
      {/* 顶部导航 */}
      <View paddingTop={insets.top}>
        <TitleBar
          title="消息中心"
          subtitle={`${conversations.length} 个对话`}
        />
      </View>

      {/* 分类标签栏 */}
      {renderCategoryTabs()}

      {/* 对话列表 */}
      {filteredConversations.length === 0 ? (
        renderEmpty()
      ) : (
        <FlatList
          data={filteredConversations}
          renderItem={renderConversationItem}
          keyExtractor={item => item.id}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
          }
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View height={insets.bottom + 20} />}
        />
      )}
    </View>
  );
};
