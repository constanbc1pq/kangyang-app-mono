/**
 * 广告横幅组件
 *
 * 会员用户不显示广告
 */

import React from 'react';
import { TouchableOpacity } from 'react-native';
import { View, Text, XStack, YStack } from 'tamagui';
import { X, Crown } from 'lucide-react-native';
import { COLORS } from '@/constants/app';
import { useAdFree } from '@/hooks/useMembershipBenefit';
import { useNavigation } from '@react-navigation/native';

interface AdBannerProps {
  /** 广告位类型 */
  type?: 'banner' | 'interstitial' | 'native';
  /** 广告位置标识 */
  placement?: string;
  /** 自定义样式 */
  style?: object;
}

/**
 * 广告横幅组件
 *
 * 根据会员状态自动判断是否显示广告
 * - 免费用户: 显示广告
 * - 会员用户: 不显示广告 (ad_free 权益)
 *
 * @example
 * // 在页面中使用
 * <AdBanner placement="home_bottom" />
 */
export const AdBanner: React.FC<AdBannerProps> = ({
  type = 'banner',
  placement = 'default',
  style,
}) => {
  const navigation = useNavigation();
  const { showAds, isLoading } = useAdFree();

  // 加载中或会员用户不显示
  if (isLoading || !showAds) {
    return null;
  }

  // 模拟广告内容 (实际项目中应接入真实广告 SDK)
  return (
    <View
      backgroundColor="$surface"
      borderRadius="$3"
      padding="$3"
      marginVertical="$2"
      borderWidth={1}
      borderColor="$borderColor"
      {...style}
    >
      <XStack justifyContent="space-between" alignItems="flex-start">
        <YStack flex={1}>
          {/* 广告标签 */}
          <XStack space="$2" alignItems="center" marginBottom="$2">
            <View
              backgroundColor={`${COLORS.textSecondary}20`}
              paddingHorizontal="$2"
              paddingVertical="$1"
              borderRadius="$2"
            >
              <Text fontSize="$1" color="$textSecondary">
                广告
              </Text>
            </View>
            <Text fontSize="$1" color="$textSecondary">
              {placement}
            </Text>
          </XStack>

          {/* 广告内容占位 */}
          <Text fontSize="$3" fontWeight="500" color="$text" marginBottom="$1">
            康养健康服务推荐
          </Text>
          <Text fontSize="$2" color="$textSecondary" numberOfLines={2}>
            升级会员享受无广告体验，还有更多专属权益
          </Text>

          {/* 升级会员按钮 */}
          <TouchableOpacity
            onPress={() => navigation.navigate('MembershipCenter' as never)}
            style={{ marginTop: 8 }}
          >
            <XStack
              backgroundColor={`${COLORS.primary}10`}
              paddingHorizontal="$3"
              paddingVertical="$2"
              borderRadius="$2"
              alignItems="center"
              space="$1"
              alignSelf="flex-start"
            >
              <Crown size={14} color={COLORS.primary} />
              <Text fontSize="$2" color={COLORS.primary} fontWeight="500">
                升级会员去广告
              </Text>
            </XStack>
          </TouchableOpacity>
        </YStack>

        {/* 关闭按钮 (不真正关闭，仅做UI展示) */}
        <TouchableOpacity>
          <View padding="$1">
            <X size={16} color={COLORS.textSecondary} />
          </View>
        </TouchableOpacity>
      </XStack>
    </View>
  );
};

/**
 * 小型广告条组件
 *
 * 适用于列表项之间的原生广告
 */
export const AdBannerSmall: React.FC<AdBannerProps> = ({ style }) => {
  const navigation = useNavigation();
  const { showAds, isLoading } = useAdFree();

  if (isLoading || !showAds) {
    return null;
  }

  return (
    <TouchableOpacity
      onPress={() => navigation.navigate('MembershipCenter' as never)}
    >
      <XStack
        backgroundColor={`${COLORS.primary}08`}
        padding="$2"
        borderRadius="$2"
        marginVertical="$2"
        alignItems="center"
        justifyContent="center"
        space="$2"
        {...style}
      >
        <Crown size={12} color={COLORS.primary} />
        <Text fontSize="$2" color={COLORS.primary}>
          升级会员，享受无广告体验
        </Text>
      </XStack>
    </TouchableOpacity>
  );
};

export default AdBanner;
