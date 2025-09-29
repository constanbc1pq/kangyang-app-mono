import React, { useEffect } from 'react';
import {
  YStack,
  XStack,
  Text,
  View,
  H1,
  Theme,
} from 'tamagui';
import { LinearGradient } from 'expo-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart } from 'lucide-react-native';
import { Animated } from 'react-native';

interface SplashScreenProps {
  onFinish?: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const logoScale = new Animated.Value(0.5);
  const logoOpacity = new Animated.Value(0);
  const loadingScale = new Animated.Value(0.8);

  useEffect(() => {
    // Logo animation
    Animated.sequence([
      Animated.parallel([
        Animated.timing(logoOpacity, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.spring(logoScale, {
          toValue: 1,
          tension: 50,
          friction: 7,
          useNativeDriver: true,
        }),
      ]),
      Animated.loop(
        Animated.sequence([
          Animated.timing(loadingScale, {
            toValue: 1,
            duration: 600,
            useNativeDriver: true,
          }),
          Animated.timing(loadingScale, {
            toValue: 0.8,
            duration: 600,
            useNativeDriver: true,
          }),
        ])
      ),
    ]).start();

    // Auto finish after 2.5 seconds
    const timer = setTimeout(() => {
      onFinish?.();
    }, 2500);

    return () => clearTimeout(timer);
  }, [logoScale, logoOpacity, loadingScale, onFinish]);

  return (
    <Theme name="light">
      <SafeAreaView style={{ flex: 1 }}>
        <LinearGradient
          colors={['#6366F1', '#8B5CF6']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1 }}
        >
          <YStack flex={1} justifyContent="center" alignItems="center" position="relative">
            {/* Background decoration */}
            <View
              position="absolute"
              top="20%"
              left="20%"
              width={180}
              height={180}
              backgroundColor="rgba(139, 92, 246, 0.2)"
              borderRadius={90}
              opacity={0.8}
            />
            <View
              position="absolute"
              bottom="20%"
              right="15%"
              width={220}
              height={220}
              backgroundColor="rgba(99, 102, 241, 0.15)"
              borderRadius={110}
              opacity={0.6}
            />
            <View
              position="absolute"
              top="40%"
              right="30%"
              width={100}
              height={100}
              backgroundColor="rgba(168, 139, 250, 0.25)"
              borderRadius={50}
              opacity={0.7}
            />

            {/* Main content */}
            <Animated.View
              style={{
                transform: [{ scale: logoScale }],
                opacity: logoOpacity,
                alignItems: 'center',
              }}
            >
              {/* App Logo */}
              <View
                width={96}
                height={96}
                backgroundColor="$primary"
                borderRadius={24}
                justifyContent="center"
                alignItems="center"
                marginBottom="$4"
                shadowColor="$primary"
                shadowOffset={{ width: 0, height: 8 }}
                shadowOpacity={0.3}
                shadowRadius={20}
                elevation={10}
              >
                <Heart size={48} color="white" />
              </View>

              <H1
                fontSize="$10"
                fontWeight="bold"
                color="white"
                textAlign="center"
                marginBottom="$2"
              >
                康养
              </H1>

              <Text
                fontSize="$5"
                color="rgba(255, 255, 255, 0.8)"
                textAlign="center"
                marginBottom="$8"
              >
                智慧健康管理
              </Text>
            </Animated.View>

            {/* Loading indicator */}
            <Animated.View style={{ transform: [{ scale: loadingScale }] }}>
              <XStack space="$2" justifyContent="center">
                <View
                  width={12}
                  height={12}
                  backgroundColor="$primary"
                  borderRadius={6}
                />
                <View
                  width={12}
                  height={12}
                  backgroundColor="$primary"
                  borderRadius={6}
                  opacity={0.7}
                />
                <View
                  width={12}
                  height={12}
                  backgroundColor="$primary"
                  borderRadius={6}
                  opacity={0.4}
                />
              </XStack>
            </Animated.View>
          </YStack>
        </LinearGradient>
      </SafeAreaView>
    </Theme>
  );
};