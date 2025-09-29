# 康养APP (Kangyang Health & Wellness App)

康养APP是一个综合性的React Native健康监测和养生生活方式移动应用，支持iOS/Android/Web三端。该应用集成了AI驱动的健康分析、IoT设备连接、生活方式服务和社交功能，为全方位健康管理提供解决方案。

## 📱 技术架构

- **Framework**: React Native 0.81.4 with Expo SDK 54
- **语言**: TypeScript 5.9+
- **状态管理**: Redux Toolkit + RTK Query
- **导航**: React Navigation 6
- **UI库**: React Native Paper
- **存储**: MMKV (加密存储)
- **包管理**: Yarn

## 🏗️ 项目结构

```
src/
├── components/        # 可复用UI组件
│   ├── common/       # 通用组件 (Button, Input等)
│   ├── charts/       # 数据可视化组件
│   ├── forms/        # 表单组件
│   └── navigation/   # 导航相关组件
├── screens/          # 页面组件
│   ├── auth/         # 认证页面 (登录, 注册)
│   ├── health/       # 健康监测页面 ("康"模块)
│   ├── lifestyle/    # 生活方式页面 ("养"模块)
│   ├── community/    # 社区页面
│   └── profile/      # 个人中心页面
├── navigation/       # 导航配置
├── store/           # Redux状态管理
│   ├── slices/      # Redux Toolkit slices
│   ├── api/         # RTK Query API endpoints
│   └── middleware/  # 自定义中间件
├── services/        # 外部服务集成
├── utils/           # 工具函数
├── constants/       # 应用常量
├── types/           # TypeScript类型定义
└── hooks/           # 自定义React hooks
```

## 🚀 开发指南

### 安装依赖

```bash
# 删除package-lock.json (如果存在)
rm package-lock.json

# 使用Yarn安装依赖
yarn install
```

### 开发命令

```bash
# 启动开发服务器
yarn start

# iOS模拟器
yarn ios

# Android模拟器
yarn android

# Web浏览器
yarn web

# TypeScript检查
yarn type-check

# 代码检查
yarn lint

# 自动修复代码格式
yarn lint:fix

# 运行测试
yarn test
```

## 🎯 功能模块

### "康"模块 - AI健康监测
- 健康数据采集和可视化
- AI驱动的健康分析报告
- 智能设备数据同步
- 健康风险评估和预警

### "养"模块 - 生活方式服务
- 运动健身跟踪
- 营养膳食管理
- 睡眠监测优化
- 心理健康支持

### 社区功能
- 健康经验分享
- 好友系统和挑战
- 专家问答
- 成就激励系统

### 个人中心
- 用户资料管理
- 家庭健康管理
- 设备绑定管理
- 隐私和安全设置

## 📋 开发状态

### ✅ 已完成
- [x] 项目初始化和基础架构
- [x] TypeScript配置和开发工具设置
- [x] Redux状态管理架构
- [x] 基础导航结构
- [x] 类型定义和常量配置
- [x] API服务基础结构
- [x] 存储和工具函数

### 🚧 进行中
- [ ] 认证系统UI开发
- [ ] 基础组件库构建

### 📅 计划中
- [ ] 健康数据输入界面
- [ ] AI分析功能集成
- [ ] 设备连接功能
- [ ] 社区功能开发

## 🔧 开发规范

1. **代码风格**: 遵循ESLint和Prettier配置
2. **组件命名**: 使用PascalCase
3. **文件命名**: 使用kebab-case
4. **类型安全**: 所有组件必须有TypeScript类型
5. **状态管理**: 使用Redux Toolkit，避免直接修改状态
6. **API调用**: 使用RTK Query，统一错误处理

## 📱 支持平台

- **iOS**: 13.0+
- **Android**: API Level 21+
- **Web**: 现代浏览器支持

## 🔐 安全特性

- MMKV加密存储
- JWT Token安全管理
- 生物识别认证支持
- 健康数据隐私保护

## 📚 相关文档

- [开发指南](./CLAUDE.md)
- [任务规划](./app-todo.md)
- [架构设计](./康养APP产品技术架构设计.md)

---

**重要提醒**: 该应用处理敏感的健康数据，开发过程中务必遵循数据安全和隐私保护最佳实践。