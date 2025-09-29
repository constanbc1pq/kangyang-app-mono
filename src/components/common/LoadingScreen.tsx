import React from 'react';
import {
  Box,
  Spinner,
  Text,
  VStack
} from '@gluestack-ui/themed';
import { COLORS } from '@/constants/app';

export const LoadingScreen: React.FC = () => {
  return (
    <Box
      flex={1}
      justifyContent="center"
      alignItems="center"
      backgroundColor={COLORS.background}
    >
      <VStack space="md" alignItems="center">
        <Spinner size="large" color={COLORS.primary} />
        <Text
          fontSize="$lg"
          fontWeight="$medium"
          color={COLORS.textSecondary}
        >
          正在加载康养APP...
        </Text>
      </VStack>
    </Box>
  );
};