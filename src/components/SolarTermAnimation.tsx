/**
 * SolarTermAnimation - 节气背景动画组件
 * 为24节气提供沉浸式的背景动画效果
 * 作为日历卡片的背景层使用
 */

import React, { useEffect, useRef, useMemo } from 'react';
import { View, Animated, StyleSheet, Easing } from 'react-native';

interface SolarTermAnimationProps {
  solarTerm: string;
  width: number;
  height: number;
}

// 雪花组件
const Snowflake: React.FC<{
  delay: number;
  duration: number;
  startX: number;
  size: number;
  opacity: number;
  containerHeight: number;
}> = ({ delay, duration, startX, size, opacity, containerHeight }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      // 重置位置
      translateY.setValue(-20);
      translateX.setValue(0);
      rotate.setValue(0);

      // 并行执行多个动画
      Animated.parallel([
        // 垂直下落
        Animated.timing(translateY, {
          toValue: containerHeight + 20,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // 水平摆动 (正弦波效果)
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 15,
            duration: duration / 4,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -15,
            duration: duration / 2,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 0,
            duration: duration / 4,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // 旋转
        Animated.timing(rotate, {
          toValue: 1,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // 动画完成后重新开始
        startAnimation();
      });
    };

    // 延迟启动，错开每个雪花的时间
    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [translateY, translateX, rotate, duration, delay, containerHeight]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <Animated.View
      style={[
        styles.snowflake,
        {
          left: startX,
          width: size,
          height: size,
          opacity: opacity,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    >
      {/* 雪花形状 - 六角星 */}
      <View style={[styles.snowflakeLine, { width: size, height: 2 }]} />
      <View style={[styles.snowflakeLine, { width: size, height: 2, transform: [{ rotate: '60deg' }] }]} />
      <View style={[styles.snowflakeLine, { width: size, height: 2, transform: [{ rotate: '120deg' }] }]} />
    </Animated.View>
  );
};

// 大雪动画 - 雪花飘落
const DaxueAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  // 生成随机雪花配置
  const snowflakes = useMemo(() => {
    const flakes = [];
    const count = 15; // 雪花数量

    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        delay: Math.random() * 3000, // 0-3秒随机延迟
        duration: 4000 + Math.random() * 3000, // 4-7秒下落时间
        startX: Math.random() * width, // 随机水平位置
        size: 6 + Math.random() * 8, // 6-14px大小
        opacity: 0.4 + Math.random() * 0.4, // 0.4-0.8透明度
      });
    }
    return flakes;
  }, [width]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      {/* 渐变背景 - 冬日灰蓝色调 */}
      <View style={[styles.gradientBg, {
        backgroundColor: '#E8EEF2',
        opacity: 0.6,
      }]} />

      {/* 雪花层 */}
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          delay={flake.delay}
          duration={flake.duration}
          startX={flake.startX}
          size={flake.size}
          opacity={flake.opacity}
          containerHeight={height}
        />
      ))}
    </View>
  );
};

// 小雪动画 - 稀疏的小雪花
const XiaoxueAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const snowflakes = useMemo(() => {
    const flakes = [];
    const count = 8; // 较少的雪花

    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        delay: Math.random() * 4000,
        duration: 5000 + Math.random() * 3000,
        startX: Math.random() * width,
        size: 4 + Math.random() * 5, // 更小的雪花
        opacity: 0.3 + Math.random() * 0.3,
      });
    }
    return flakes;
  }, [width]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#EDF1F5', opacity: 0.5 }]} />
      {snowflakes.map((flake) => (
        <Snowflake
          key={flake.id}
          delay={flake.delay}
          duration={flake.duration}
          startX={flake.startX}
          size={flake.size}
          opacity={flake.opacity}
          containerHeight={height}
        />
      ))}
    </View>
  );
};

// 稻穗/麦穗组件 - 用于小满、芒种等
const GrainStalk: React.FC<{
  x: number;
  height: number;
  delay: number;
  color: string;
}> = ({ x, height: stalkHeight, delay, color }) => {
  const swayAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startSway = () => {
      Animated.sequence([
        Animated.timing(swayAnim, {
          toValue: 1,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: -1,
          duration: 2000 + Math.random() * 1000,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(swayAnim, {
          toValue: 0,
          duration: 1500,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]).start(() => startSway());
    };

    const timer = setTimeout(startSway, delay);
    return () => clearTimeout(timer);
  }, [swayAnim, delay]);

  const rotateInterpolate = swayAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-8deg', '0deg', '8deg'],
  });

  return (
    <Animated.View
      style={[
        styles.grainStalk,
        {
          left: x,
          height: stalkHeight,
          backgroundColor: color,
          transform: [
            { rotate: rotateInterpolate },
          ],
          transformOrigin: 'bottom center',
        },
      ]}
    >
      {/* 穗头 */}
      <View style={[styles.grainHead, { backgroundColor: color }]} />
    </Animated.View>
  );
};

// 小满动画 - 青翠稻谷摇曳
const XiaomanAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const stalks = useMemo(() => {
    const result = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        x: (width / count) * i + Math.random() * 10,
        height: 30 + Math.random() * 20,
        delay: Math.random() * 1000,
        color: `hsl(${100 + Math.random() * 20}, ${60 + Math.random() * 20}%, ${40 + Math.random() * 15}%)`,
      });
    }
    return result;
  }, [width]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#E8F5E9', opacity: 0.6 }]} />
      <View style={styles.groundContainer}>
        {stalks.map((stalk) => (
          <GrainStalk
            key={stalk.id}
            x={stalk.x}
            height={stalk.height}
            delay={stalk.delay}
            color={stalk.color}
          />
        ))}
      </View>
    </View>
  );
};

// 树叶组件 - 用于大暑、立秋等
const TreeLeaf: React.FC<{
  x: number;
  y: number;
  size: number;
  delay: number;
  color: string;
}> = ({ x, y, size, delay, color }) => {
  const swayAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.parallel([
        // 摇摆
        Animated.sequence([
          Animated.timing(swayAnim, {
            toValue: 1,
            duration: 1500 + Math.random() * 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(swayAnim, {
            toValue: -1,
            duration: 1500 + Math.random() * 500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(swayAnim, {
            toValue: 0,
            duration: 1000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        // 轻微缩放
        Animated.sequence([
          Animated.timing(scaleAnim, {
            toValue: 1.05,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.98,
            duration: 2000,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => startAnimation());
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [swayAnim, scaleAnim, delay]);

  const rotateInterpolate = swayAnim.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: ['-12deg', '0deg', '12deg'],
  });

  return (
    <Animated.View
      style={[
        styles.treeLeaf,
        {
          left: x,
          top: y,
          width: size,
          height: size * 1.5,
          backgroundColor: color,
          transform: [
            { rotate: rotateInterpolate },
            { scale: scaleAnim },
          ],
        },
      ]}
    />
  );
};

// 大暑动画 - 树荫摇曳
const DashuAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const leaves = useMemo(() => {
    const result = [];
    const count = 18;

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * (height * 0.6),
        size: 12 + Math.random() * 10,
        delay: Math.random() * 1500,
        color: `hsl(${120 + Math.random() * 30}, ${50 + Math.random() * 20}%, ${30 + Math.random() * 20}%)`,
      });
    }
    return result;
  }, [width, height]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#C8E6C9', opacity: 0.5 }]} />
      {leaves.map((leaf) => (
        <TreeLeaf
          key={leaf.id}
          x={leaf.x}
          y={leaf.y}
          size={leaf.size}
          delay={leaf.delay}
          color={leaf.color}
        />
      ))}
    </View>
  );
};

// 雨滴组件 - 用于雨水、谷雨等
const Raindrop: React.FC<{
  startX: number;
  delay: number;
  duration: number;
  containerHeight: number;
}> = ({ startX, delay, duration, containerHeight }) => {
  const translateY = useRef(new Animated.Value(-10)).current;
  const opacity = useRef(new Animated.Value(0.6)).current;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(-10);
      opacity.setValue(0.6);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: containerHeight + 10,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: duration * 0.3,
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.2,
            duration: duration * 0.7,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => startAnimation());
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [translateY, opacity, duration, delay, containerHeight]);

  return (
    <Animated.View
      style={[
        styles.raindrop,
        {
          left: startX,
          opacity,
          transform: [{ translateY }],
        },
      ]}
    />
  );
};

// 雨水/谷雨动画
const RainAnimation: React.FC<{ width: number; height: number; intensity: 'light' | 'heavy' }> = ({
  width, height, intensity
}) => {
  const raindrops = useMemo(() => {
    const drops = [];
    const count = intensity === 'heavy' ? 20 : 10;

    for (let i = 0; i < count; i++) {
      drops.push({
        id: i,
        startX: Math.random() * width,
        delay: Math.random() * 2000,
        duration: 800 + Math.random() * 600,
      });
    }
    return drops;
  }, [width, intensity]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#E3F2FD', opacity: 0.6 }]} />
      {raindrops.map((drop) => (
        <Raindrop
          key={drop.id}
          startX={drop.startX}
          delay={drop.delay}
          duration={drop.duration}
          containerHeight={height}
        />
      ))}
    </View>
  );
};

// 花瓣组件 - 用于春分、清明等
const Petal: React.FC<{
  startX: number;
  delay: number;
  duration: number;
  size: number;
  color: string;
  containerHeight: number;
}> = ({ startX, delay, duration, size, color, containerHeight }) => {
  const translateY = useRef(new Animated.Value(-20)).current;
  const translateX = useRef(new Animated.Value(0)).current;
  const rotate = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startAnimation = () => {
      translateY.setValue(-20);
      translateX.setValue(0);
      rotate.setValue(0);

      Animated.parallel([
        Animated.timing(translateY, {
          toValue: containerHeight + 20,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
        // 飘动效果
        Animated.sequence([
          Animated.timing(translateX, {
            toValue: 30,
            duration: duration / 3,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: -20,
            duration: duration / 3,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(translateX, {
            toValue: 10,
            duration: duration / 3,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.timing(rotate, {
          toValue: 2,
          duration: duration,
          easing: Easing.linear,
          useNativeDriver: true,
        }),
      ]).start(() => startAnimation());
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [translateY, translateX, rotate, duration, delay, containerHeight]);

  const rotateInterpolate = rotate.interpolate({
    inputRange: [0, 2],
    outputRange: ['0deg', '720deg'],
  });

  return (
    <Animated.View
      style={[
        styles.petal,
        {
          left: startX,
          width: size,
          height: size * 1.2,
          backgroundColor: color,
          transform: [
            { translateY },
            { translateX },
            { rotate: rotateInterpolate },
          ],
        },
      ]}
    />
  );
};

// 春分/清明动画 - 花瓣飘落
const SpringAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const petals = useMemo(() => {
    const result = [];
    const count = 10;
    const colors = ['#FFCDD2', '#F8BBD9', '#FFE0B2', '#FFF9C4'];

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        startX: Math.random() * width,
        delay: Math.random() * 4000,
        duration: 5000 + Math.random() * 3000,
        size: 8 + Math.random() * 6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return result;
  }, [width]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#FFF8E1', opacity: 0.5 }]} />
      {petals.map((petal) => (
        <Petal
          key={petal.id}
          startX={petal.startX}
          delay={petal.delay}
          duration={petal.duration}
          size={petal.size}
          color={petal.color}
          containerHeight={height}
        />
      ))}
    </View>
  );
};

// 落叶动画 - 秋分、霜降等
const AutumnLeafAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const leaves = useMemo(() => {
    const result = [];
    const count = 8;
    const colors = ['#FF8A65', '#FFB74D', '#FFA726', '#FFCC80', '#D4E157'];

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        startX: Math.random() * width,
        delay: Math.random() * 3000,
        duration: 6000 + Math.random() * 3000,
        size: 10 + Math.random() * 8,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
    return result;
  }, [width]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#FFF3E0', opacity: 0.5 }]} />
      {leaves.map((leaf) => (
        <Petal
          key={leaf.id}
          startX={leaf.startX}
          delay={leaf.delay}
          duration={leaf.duration}
          size={leaf.size}
          color={leaf.color}
          containerHeight={height}
        />
      ))}
    </View>
  );
};

// 阳光闪烁组件 - 用于夏至等
const SunRay: React.FC<{
  x: number;
  y: number;
  delay: number;
}> = ({ x, y, delay }) => {
  const opacity = useRef(new Animated.Value(0.3)).current;
  const scale = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    const startAnimation = () => {
      Animated.parallel([
        Animated.sequence([
          Animated.timing(opacity, {
            toValue: 0.8,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(opacity, {
            toValue: 0.3,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
        Animated.sequence([
          Animated.timing(scale, {
            toValue: 1.2,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            toValue: 0.8,
            duration: 1500,
            easing: Easing.inOut(Easing.sin),
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => startAnimation());
    };

    const timer = setTimeout(startAnimation, delay);
    return () => clearTimeout(timer);
  }, [opacity, scale, delay]);

  return (
    <Animated.View
      style={[
        styles.sunRay,
        {
          left: x,
          top: y,
          opacity,
          transform: [{ scale }],
        },
      ]}
    />
  );
};

// 夏至动画 - 阳光闪烁
const SummerSolsticeAnimation: React.FC<{ width: number; height: number }> = ({ width, height }) => {
  const rays = useMemo(() => {
    const result = [];
    const count = 12;

    for (let i = 0; i < count; i++) {
      result.push({
        id: i,
        x: Math.random() * width,
        y: Math.random() * height,
        delay: Math.random() * 2000,
      });
    }
    return result;
  }, [width, height]);

  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: '#FFFDE7', opacity: 0.6 }]} />
      {rays.map((ray) => (
        <SunRay key={ray.id} x={ray.x} y={ray.y} delay={ray.delay} />
      ))}
    </View>
  );
};

// 默认静态背景
const DefaultAnimation: React.FC<{ width: number; height: number; bgColor: string }> = ({
  width, height, bgColor
}) => {
  return (
    <View style={[styles.animationContainer, { width, height }]}>
      <View style={[styles.gradientBg, { backgroundColor: bgColor, opacity: 0.4 }]} />
    </View>
  );
};

// 节气动画配置映射
const SOLAR_TERM_ANIMATION_CONFIG: Record<string, {
  component: 'snow' | 'lightSnow' | 'grain' | 'tree' | 'rain' | 'lightRain' | 'spring' | 'autumn' | 'summer' | 'default';
  bgColor: string;
}> = {
  // 春季
  立春: { component: 'spring', bgColor: '#E8F5E9' },
  雨水: { component: 'lightRain', bgColor: '#E3F2FD' },
  惊蛰: { component: 'spring', bgColor: '#F1F8E9' },
  春分: { component: 'spring', bgColor: '#FFF8E1' },
  清明: { component: 'spring', bgColor: '#F3E5F5' },
  谷雨: { component: 'rain', bgColor: '#E0F7FA' },
  // 夏季
  立夏: { component: 'tree', bgColor: '#E8F5E9' },
  小满: { component: 'grain', bgColor: '#F1F8E9' },
  芒种: { component: 'grain', bgColor: '#FFF8E1' },
  夏至: { component: 'summer', bgColor: '#FFFDE7' },
  小暑: { component: 'tree', bgColor: '#F1F8E9' },
  大暑: { component: 'tree', bgColor: '#C8E6C9' },
  // 秋季
  立秋: { component: 'autumn', bgColor: '#FFF3E0' },
  处暑: { component: 'tree', bgColor: '#FFECB3' },
  白露: { component: 'default', bgColor: '#ECEFF1' },
  秋分: { component: 'autumn', bgColor: '#FFE0B2' },
  寒露: { component: 'autumn', bgColor: '#FFCCBC' },
  霜降: { component: 'autumn', bgColor: '#D7CCC8' },
  // 冬季
  立冬: { component: 'lightSnow', bgColor: '#ECEFF1' },
  小雪: { component: 'lightSnow', bgColor: '#E8EEF2' },
  大雪: { component: 'snow', bgColor: '#E0E7ED' },
  冬至: { component: 'snow', bgColor: '#E3E8ED' },
  小寒: { component: 'snow', bgColor: '#E5EAEF' },
  大寒: { component: 'snow', bgColor: '#E8EDF2' },
};

export const SolarTermAnimation: React.FC<SolarTermAnimationProps> = ({
  solarTerm,
  width,
  height,
}) => {
  const config = SOLAR_TERM_ANIMATION_CONFIG[solarTerm] || { component: 'default', bgColor: '#F5F5F5' };

  switch (config.component) {
    case 'snow':
      return <DaxueAnimation width={width} height={height} />;
    case 'lightSnow':
      return <XiaoxueAnimation width={width} height={height} />;
    case 'grain':
      return <XiaomanAnimation width={width} height={height} />;
    case 'tree':
      return <DashuAnimation width={width} height={height} />;
    case 'rain':
      return <RainAnimation width={width} height={height} intensity="heavy" />;
    case 'lightRain':
      return <RainAnimation width={width} height={height} intensity="light" />;
    case 'spring':
      return <SpringAnimation width={width} height={height} />;
    case 'autumn':
      return <AutumnLeafAnimation width={width} height={height} />;
    case 'summer':
      return <SummerSolsticeAnimation width={width} height={height} />;
    default:
      return <DefaultAnimation width={width} height={height} bgColor={config.bgColor} />;
  }
};

const styles = StyleSheet.create({
  animationContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    overflow: 'hidden',
    borderRadius: 16,
  },
  gradientBg: {
    ...StyleSheet.absoluteFillObject,
  },
  snowflake: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  snowflakeLine: {
    position: 'absolute',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 1,
  },
  grainStalk: {
    position: 'absolute',
    bottom: 0,
    width: 3,
    borderRadius: 2,
  },
  grainHead: {
    position: 'absolute',
    top: -8,
    left: -4,
    width: 10,
    height: 12,
    borderRadius: 5,
  },
  groundContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
  },
  treeLeaf: {
    position: 'absolute',
    borderRadius: 50,
    borderTopLeftRadius: 2,
  },
  raindrop: {
    position: 'absolute',
    top: 0,
    width: 2,
    height: 12,
    backgroundColor: '#90CAF9',
    borderRadius: 1,
  },
  petal: {
    position: 'absolute',
    top: 0,
    borderRadius: 50,
    borderTopLeftRadius: 2,
  },
  sunRay: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#FFEB3B',
  },
});

export default SolarTermAnimation;
