import React from 'react';
import { View, XStack, YStack, Text } from 'tamagui';
import { Pressable } from 'react-native';
import {
  Users,
  Package,
  MapPin,
  Award,
  BookOpen,
  Briefcase,
  MessageCircle,
  User,
} from 'lucide-react-native';
import { COLORS } from '@/constants/app';

export interface CircleNavItem {
  id: string;
  label: string;
  icon: string;
  color: string;
  route: string;
  params?: any;
  badge?: number; // 红点数量，0或undefined表示不显示
}

interface CircleNavigationProps {
  items: CircleNavItem[];
  onItemPress: (item: CircleNavItem) => void;
}

export const CircleNavigation: React.FC<CircleNavigationProps> = ({
  items,
  onItemPress,
}) => {
  // 确保最多显示6个项目
  const displayItems = items.slice(0, 6);

  // 按每行3个项目分组
  const rows: CircleNavItem[][] = [];
  for (let i = 0; i < displayItems.length; i += 3) {
    rows.push(displayItems.slice(i, i + 3));
  }

  return (
    <YStack space="$3" paddingHorizontal="$4" marginBottom="$4">
      {rows.map((row, rowIndex) => (
        <XStack key={rowIndex} justifyContent="space-around" alignItems="center">
          {row.map((item) => (
            <Pressable
              key={item.id}
              onPress={() => onItemPress(item)}
              style={{ alignItems: 'center', width: 70 }}
            >
              <View position="relative">
                <View
                  width={56}
                  height={56}
                  borderRadius={28}
                  backgroundColor={`${item.color}20`}
                  justifyContent="center"
                  alignItems="center"
                  marginBottom="$2"
                >
                  {/[\p{Emoji}]/u.test(item.icon) ? (
                    <Text fontSize={32}>{item.icon}</Text>
                  ) : (
                    getIcon(item.icon, item.color)
                  )}
                </View>
                {/* 未读红点 */}
                {item.badge !== undefined && item.badge > 0 && (
                  <View
                    position="absolute"
                    top={-2}
                    right={-2}
                    minWidth={18}
                    height={18}
                    borderRadius={9}
                    backgroundColor={COLORS.error}
                    justifyContent="center"
                    alignItems="center"
                    paddingHorizontal={4}
                  >
                    <Text fontSize={10} color="white" fontWeight="600">
                      {item.badge > 99 ? '99+' : item.badge}
                    </Text>
                  </View>
                )}
              </View>
              <Text
                fontSize="$2"
                color="$text"
                textAlign="center"
                numberOfLines={1}
              >
                {item.label}
              </Text>
            </Pressable>
          ))}
          {/* 填充空白位置 */}
          {row.length < 3 &&
            Array.from({ length: 3 - row.length }).map((_, index) => (
              <View key={`empty-${index}`} width={70} height={80} />
            ))}
        </XStack>
      ))}
    </YStack>
  );
};

// 根据图标名称返回对应的图标组件
const getIcon = (iconName: string, color: string) => {
  const iconProps = { size: 28, color };

  switch (iconName) {
    case 'users':
      return <Users {...iconProps} />;
    case 'package':
      return <Package {...iconProps} />;
    case 'map-pin':
      return <MapPin {...iconProps} />;
    case 'award':
      return <Award {...iconProps} />;
    case 'book-open':
      return <BookOpen {...iconProps} />;
    case 'briefcase':
      return <Briefcase {...iconProps} />;
    case 'message-circle':
      return <MessageCircle {...iconProps} />;
    case 'user':
      return <User {...iconProps} />;
    default:
      return <Users {...iconProps} />;
  }
};

// 默认导航配置（6个按钮，一行3个）
export const defaultCircleNavItems: CircleNavItem[] = [
  {
    id: 'job',
    label: '邻里帮',
    icon: '🤝',
    color: COLORS.primary,
    route: 'JobList',
  },
  {
    id: 'secondhand',
    label: '邻里闲物',
    icon: '🛍️',
    color: COLORS.success,
    route: 'SecondHandList',
  },
  {
    id: 'article',
    label: '邻里分享',
    icon: '📝',
    color: COLORS.warning,
    route: 'ArticleList',
  },
  {
    id: 'expert',
    label: '认证达人',
    icon: '🏆',
    color: '#f59e0b',
    route: 'ExpertList',
  },
  {
    id: 'expert-work',
    label: '我要接单',
    icon: '💼',
    color: '#ec4899',
    route: 'ExpertDashboard',
  },
  {
    id: 'message',
    label: '消息中心',
    icon: '💬',
    color: '#06b6d4',
    route: 'ChatList',
  },
];
