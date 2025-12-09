import React, { useState, useEffect, useRef } from 'react';
import { View, ScrollView, Dimensions, Pressable, Image, StyleSheet, ImageSourcePropType } from 'react-native';
import { XStack, Text } from 'tamagui';
import { COLORS } from '@/constants/app';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BANNER_HEIGHT = 160;
const AUTO_PLAY_INTERVAL = 3000; // 3秒自动切换

export interface BannerItem {
  id: string;
  image: string | ImageSourcePropType;
  title?: string;
  link?: string;
  linkType?: 'job' | 'secondhand' | 'expert' | 'article' | 'external';
  linkId?: string;
}

interface BannerSliderProps {
  banners: BannerItem[];
  onBannerPress?: (banner: BannerItem) => void;
}

export const BannerSlider: React.FC<BannerSliderProps> = ({
  banners,
  onBannerPress,
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // 自动播放
  useEffect(() => {
    if (banners.length <= 1) return;

    const startAutoPlay = () => {
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * SCREEN_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }, AUTO_PLAY_INTERVAL);
    };

    startAutoPlay();

    return () => {
      if (autoPlayTimerRef.current) {
        clearInterval(autoPlayTimerRef.current);
      }
    };
  }, [banners.length]);

  // 处理手动滑动
  const handleScroll = (event: any) => {
    const offsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(offsetX / SCREEN_WIDTH);
    setCurrentIndex(index);

    // 重置自动播放定时器
    if (autoPlayTimerRef.current) {
      clearInterval(autoPlayTimerRef.current);
      autoPlayTimerRef.current = setInterval(() => {
        setCurrentIndex((prevIndex) => {
          const nextIndex = (prevIndex + 1) % banners.length;
          scrollViewRef.current?.scrollTo({
            x: nextIndex * SCREEN_WIDTH,
            animated: true,
          });
          return nextIndex;
        });
      }, AUTO_PLAY_INTERVAL);
    }
  };

  const handleBannerPress = (banner: BannerItem) => {
    if (onBannerPress) {
      onBannerPress(banner);
    }
  };

  if (banners.length === 0) {
    return null;
  }

  return (
    <View style={{ width: SCREEN_WIDTH, height: BANNER_HEIGHT, marginBottom: 16 }}>
      {/* 轮播图 */}
      <ScrollView
        ref={scrollViewRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}
        style={{ flex: 1 }}
      >
        {banners.map((banner) => (
          <Pressable
            key={banner.id}
            onPress={() => handleBannerPress(banner)}
            style={{ width: SCREEN_WIDTH, paddingHorizontal: 16 }}
          >
            <View
              style={{
                width: SCREEN_WIDTH - 32,
                height: BANNER_HEIGHT,
                borderRadius: 12,
                overflow: 'hidden',
                backgroundColor: COLORS.background,
                position: 'relative',
              }}
            >
              {/* 占位符背景 */}
              <View style={{
                width: '100%',
                height: '100%',
                backgroundColor: '#f0f0f0',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
                <Text fontSize={60} opacity={0.3}>🖼️</Text>
              </View>

              {/* 真实图片 */}
              <Image
                key={banner.id}
                source={typeof banner.image === 'string' ? { uri: banner.image } : banner.image}
                style={styles.bannerImage}
                resizeMode="cover"
              />

              {/* 渐变遮罩 + 标题 */}
              {banner.title && (
                <View style={styles.bannerOverlay}>
                  <Text
                    fontSize="$6"
                    fontWeight="700"
                    color="white"
                    textAlign="center"
                    style={{ textShadowColor: 'rgba(0, 0, 0, 0.5)', textShadowOffset: { width: 0, height: 2 }, textShadowRadius: 4 }}
                  >
                    {banner.title}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        ))}
      </ScrollView>

      {/* 指示点 */}
      {banners.length > 1 && (
        <XStack
          position="absolute"
          bottom={12}
          left={0}
          right={0}
          justifyContent="center"
          alignItems="center"
          space="$2"
        >
          {banners.map((_, index) => (
            <View
              key={index}
              style={{
                width: currentIndex === index ? 16 : 6,
                height: 6,
                borderRadius: 3,
                backgroundColor:
                  currentIndex === index
                    ? 'white'
                    : 'rgba(255, 255, 255, 0.5)',
                transition: 'all 0.3s ease',
              }}
            />
          ))}
        </XStack>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  bannerImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    zIndex: 5,
  },
  bannerOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
});
