import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ActivityIndicator, Text } from 'react-native-paper';
import { COLORS, SPACING } from '@/constants/app';

export const LoadingScreen: React.FC = () => {
  return (
    <View style={styles.container}>
      <ActivityIndicator animating size="large" color={COLORS.primary} />
      <Text style={styles.text}>正在加载康养APP...</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  text: {
    marginTop: SPACING.md,
    color: COLORS.textSecondary,
    fontSize: 16,
  },
});