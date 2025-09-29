const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const config = getDefaultConfig(__dirname);

// Web支持
config.resolver.platforms = ['ios', 'android', 'native', 'web'];

// 支持更多文件扩展
config.resolver.sourceExts = ['js', 'jsx', 'ts', 'tsx', 'json'];

// 添加node_modules解析路径
config.resolver.nodeModulesPaths = [
  path.resolve(__dirname, 'node_modules'),
];

// 添加TypeScript路径别名支持和Web特定配置
config.resolver.alias = {
  // TypeScript路径别名
  '@': path.resolve(__dirname, 'src'),
  '@/components': path.resolve(__dirname, 'src/components'),
  '@/screens': path.resolve(__dirname, 'src/screens'),
  '@/navigation': path.resolve(__dirname, 'src/navigation'),
  '@/store': path.resolve(__dirname, 'src/store'),
  '@/services': path.resolve(__dirname, 'src/services'),
  '@/utils': path.resolve(__dirname, 'src/utils'),
  '@/constants': path.resolve(__dirname, 'src/constants'),
  '@/types': path.resolve(__dirname, 'src/types'),
  '@/hooks': path.resolve(__dirname, 'src/hooks'),
  '@/theme': path.resolve(__dirname, 'src/theme'),

  // 明确指定问题包的解析
  'clsx': path.resolve(__dirname, 'node_modules/clsx/dist/clsx.js'),

  // Web特定别名
  'react-native$': 'react-native-web',
};

// 确保Metro能找到所有模块
config.resolver.resolverMainFields = ['react-native', 'browser', 'main'];

module.exports = config;