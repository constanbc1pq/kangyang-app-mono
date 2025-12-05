/**
 * SolarTermIcon - 24节气动画图标组件
 * 根据当前节气显示对应的动画效果
 * 遵循 CLAUDE.md 组件规范
 */

import React, { useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet } from 'react-native';
import { View, useTheme } from 'tamagui';
import {
  Snowflake,
  CloudRain,
  Sprout,
  Sun,
  CloudSun,
  Flower2,
  Leaf,
  Wind,
  Thermometer,
  Droplets,
  TreeDeciduous,
  Moon,
  CloudSnow,
  Wheat,
  Bug,
} from 'lucide-react-native';

interface SolarTermIconProps {
  solarTerm: string;
  size?: number;
}

// 节气配置：图标、颜色、动画类型
interface SolarTermConfig {
  icon: React.ElementType;
  color: string;
  bgColor: string;
  animation: 'pulse' | 'rotate' | 'bounce' | 'shake' | 'float';
}

const SOLAR_TERM_CONFIG: Record<string, SolarTermConfig> = {
  // 春季
  立春: { icon: Sprout, color: '#4CAF50', bgColor: '#E8F5E9', animation: 'bounce' },
  雨水: { icon: CloudRain, color: '#2196F3', bgColor: '#E3F2FD', animation: 'float' },
  惊蛰: { icon: Bug, color: '#8BC34A', bgColor: '#F1F8E9', animation: 'shake' },
  春分: { icon: Flower2, color: '#E91E63', bgColor: '#FCE4EC', animation: 'rotate' },
  清明: { icon: Wind, color: '#00BCD4', bgColor: '#E0F7FA', animation: 'float' },
  谷雨: { icon: Droplets, color: '#03A9F4', bgColor: '#E1F5FE', animation: 'bounce' },

  // 夏季
  立夏: { icon: Sun, color: '#FF9800', bgColor: '#FFF3E0', animation: 'pulse' },
  小满: { icon: Wheat, color: '#FFC107', bgColor: '#FFF8E1', animation: 'float' },
  芒种: { icon: Wheat, color: '#CDDC39', bgColor: '#F9FBE7', animation: 'bounce' },
  夏至: { icon: Sun, color: '#FF5722', bgColor: '#FBE9E7', animation: 'rotate' },
  小暑: { icon: Thermometer, color: '#F44336', bgColor: '#FFEBEE', animation: 'pulse' },
  大暑: { icon: Thermometer, color: '#D32F2F', bgColor: '#FFCDD2', animation: 'shake' },

  // 秋季
  立秋: { icon: Leaf, color: '#FF9800', bgColor: '#FFF3E0', animation: 'float' },
  处暑: { icon: CloudSun, color: '#FFB74D', bgColor: '#FFF8E1', animation: 'pulse' },
  白露: { icon: Droplets, color: '#90CAF9', bgColor: '#E3F2FD', animation: 'bounce' },
  秋分: { icon: TreeDeciduous, color: '#FF7043', bgColor: '#FBE9E7', animation: 'rotate' },
  寒露: { icon: Moon, color: '#7986CB', bgColor: '#E8EAF6', animation: 'float' },
  霜降: { icon: Snowflake, color: '#9FA8DA', bgColor: '#E8EAF6', animation: 'shake' },

  // 冬季
  立冬: { icon: Wind, color: '#78909C', bgColor: '#ECEFF1', animation: 'float' },
  小雪: { icon: CloudSnow, color: '#90A4AE', bgColor: '#ECEFF1', animation: 'bounce' },
  大雪: { icon: Snowflake, color: '#B0BEC5', bgColor: '#ECEFF1', animation: 'rotate' },
  冬至: { icon: Moon, color: '#5C6BC0', bgColor: '#E8EAF6', animation: 'pulse' },
  小寒: { icon: Snowflake, color: '#7986CB', bgColor: '#E8EAF6', animation: 'shake' },
  大寒: { icon: Snowflake, color: '#3F51B5', bgColor: '#E8EAF6', animation: 'float' },
};

// 默认配置
const DEFAULT_CONFIG: SolarTermConfig = {
  icon: Sun,
  color: '#9C27B0',
  bgColor: '#F3E5F5',
  animation: 'pulse',
};

export const SolarTermIcon: React.FC<SolarTermIconProps> = ({
  solarTerm,
  size = 48,
}) => {
  const theme = useTheme();
  const animatedValue = useRef(new Animated.Value(0)).current;
  const config = SOLAR_TERM_CONFIG[solarTerm] || DEFAULT_CONFIG;
  const IconComponent = config.icon;

  useEffect(() => {
    let animation: Animated.CompositeAnimation;

    switch (config.animation) {
      case 'pulse':
        // 脉冲呼吸效果
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 1500,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'rotate':
        // 缓慢旋转效果
        animation = Animated.loop(
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 8000,
            easing: Easing.linear,
            useNativeDriver: true,
          })
        );
        break;

      case 'bounce':
        // 上下弹跳效果
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 800,
              easing: Easing.out(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 800,
              easing: Easing.in(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'shake':
        // 左右摇摆效果
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: -1,
              duration: 600,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 300,
              easing: Easing.inOut(Easing.ease),
              useNativeDriver: true,
            }),
          ])
        );
        break;

      case 'float':
        // 漂浮效果
        animation = Animated.loop(
          Animated.sequence([
            Animated.timing(animatedValue, {
              toValue: 1,
              duration: 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
            Animated.timing(animatedValue, {
              toValue: 0,
              duration: 2000,
              easing: Easing.inOut(Easing.sin),
              useNativeDriver: true,
            }),
          ])
        );
        break;
    }

    animation.start();
    return () => animation.stop();
  }, [config.animation, animatedValue]);

  // 根据动画类型计算变换
  const getAnimatedStyle = () => {
    switch (config.animation) {
      case 'pulse':
        return {
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 1.15],
              }),
            },
          ],
          opacity: animatedValue.interpolate({
            inputRange: [0, 1],
            outputRange: [0.8, 1],
          }),
        };

      case 'rotate':
        return {
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
          ],
        };

      case 'bounce':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -4],
              }),
            },
          ],
        };

      case 'shake':
        return {
          transform: [
            {
              rotate: animatedValue.interpolate({
                inputRange: [-1, 0, 1],
                outputRange: ['-8deg', '0deg', '8deg'],
              }),
            },
          ],
        };

      case 'float':
        return {
          transform: [
            {
              translateY: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, -3],
              }),
            },
            {
              translateX: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 2],
              }),
            },
          ],
        };

      default:
        return {};
    }
  };

  const iconSize = size * 0.5;

  return (
    <View
      width={size}
      height={size}
      borderRadius={size / 2}
      backgroundColor={config.bgColor}
      justifyContent="center"
      alignItems="center"
      overflow="hidden"
    >
      <Animated.View style={[styles.iconContainer, getAnimatedStyle()]}>
        <IconComponent size={iconSize} color={config.color} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default SolarTermIcon;
