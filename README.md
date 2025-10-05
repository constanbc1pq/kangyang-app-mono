# 九紫康养APP (Kangyang Health & Wellness App)

九紫康养APP是一个综合性的React Native健康监测和养生生活方式移动应用，支持iOS/Android/Web三端。该应用集成了AI驱动的健康分析、IoT设备连接、生活方式服务和社交功能，为全方位健康管理提供解决方案。

## 📱 技术架构

- **Framework**: React Native 0.81.4 with Expo SDK 54
- **语言**: TypeScript 5.9+
- **状态管理**: Redux Toolkit + RTK Query + Redux Persist
- **导航**: React Navigation 6 (Stack + Tab Navigator)
- **UI库**: Tamagui 1.134.4
- **图标**: Lucide React Native
- **存储**: AsyncStorage (本地数据持久化)
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
- ✅ 今日健康数据展示（心率、步数、睡眠）
- ✅ AI健康咨询系统（多轮对话、模型选择、智能回复）
- ✅ 智能设备管理（5种设备类型、添加设备、数据同步、本地存储）
- ✅ 健康任务管理（任务创建、进度跟踪、完成奖励、历史记录）
- ✅ 今日任务展示（任务列表、完成进度、快捷导航）
- 🚧 健康报告详情（完整评估、趋势分析）
- 🚧 用药提醒管理（药物录入、服药记录）

### "养"模块 - 生活方式服务
- ✅ 养生服务总览（6种服务分类入口）
- ✅ 营养配餐服务（4种套餐、营养师团队、购买流程）
- ✅ 送餐上门商城（商品分类、购物车、限时秒杀、订单结算）
- ✅ 养老服务系统（长者照顾、陪诊服务、医护替补、护理员详情）
- ✅ AI营养师（拍照识别、三餐切换、营养成分、AI建议）
- ✅ 营养师预约（预约日历、时段选择、咨询订单）
- ✅ 全局订单系统（订单列表、订单详情、搜索筛选、支付流程）
- ✅ 收货地址管理（地址CRUD、默认地址）
- 🚧 私人医生、康复理疗、保险规划服务

### 社区功能
- ✅ 社区主页（健康资讯/专家讲座/用户社区三个Tab）
- ✅ 文章系统（文章列表、文章详情、分类筛选、搜索、收藏点赞）
- ✅ 视频系统（视频列表、视频详情、2列网格布局、分类筛选、点赞关注）
- ✅ 话题系统（话题详情、关注话题、相关讨论、趋势指示）
- ✅ 圈子系统（圈子列表、圈子详情、加入/退出、成员管理）
- ✅ 精选内容卡片（文章/视频/直播跳转）
- ✅ 热门话题导航（ChevronRight示能、Pressable交互）
- 🚧 评论系统、动态发布、好友系统

### 个人中心
- ✅ 个人信息展示（用户资料、会员等级、成就系统）
- ✅ 家庭健康管理（家庭成员列表、健康状态监控）
- ✅ 健康档案管理（体检报告、血压血糖记录）
- ✅ 会员中心（会员权益、升级选项）
- ✅ 快捷操作（账户设置、消息通知、隐私安全、支付管理）
- ✅ 订单管理（订单Tab、订单列表入口）
- 🚧 头像上传、信息编辑、设备管理

## 📋 开发状态

### ✅ 已完成
- [x] 项目初始化和基础架构（Expo SDK 54 + TypeScript 5.9+）
- [x] Redux状态管理架构（Redux Toolkit + RTK Query + Redux Persist）
- [x] Tamagui UI库集成（1.134.4版本，Toast组件）
- [x] 导航系统（Stack + Tab Navigator，全屏页面管理）
- [x] 认证系统（测试用户登录，状态管理，导航切换）
- [x] AzurePop主题设计（#c855f0主色，#89fffd次要色）
- [x] 本地数据存储（AsyncStorage，用户数据持久化）
- [x] AI健康咨询系统（多轮对话，模型选择）
- [x] 设备管理系统（设备CRUD，本地存储）
- [x] 健康任务管理（任务CRUD，历史记录，成就系统）
- [x] 营养配餐服务（套餐展示，营养师详情，预约系统）
- [x] 送餐上门商城（商品分类，购物车，订单结算）
- [x] 养老服务模块（护理员列表，详情页，AI客服对话）
- [x] 全局订单系统（订单CRUD，搜索筛选，支付流程）
- [x] 社区详情页面（文章/视频/话题/圈子，7个详情页）
- [x] 个人中心模块（个人信息，家庭管理，健康档案，会员中心）

### 🚧 进行中
- [ ] 评论系统开发
- [ ] 视频播放器集成（expo-av）
- [ ] 健康报告详情页
- [ ] 用药提醒管理

### 📅 计划中
- [ ] 私人医生、康复理疗、保险规划服务
- [ ] 动态发布功能
- [ ] 好友系统和挑战
- [ ] 生物识别认证
- [ ] 图片上传和缓存优化

## 🔧 开发规范

1. **代码风格**: 遵循ESLint和Prettier配置
2. **组件命名**: 使用PascalCase（如 `ArticleDetailScreen`）
3. **文件命名**: 使用PascalCase（如 `ArticleDetailScreen.tsx`）
4. **类型安全**: 所有组件必须有TypeScript类型
5. **状态管理**: 使用Redux Toolkit，避免直接修改状态
6. **API调用**: 使用RTK Query，统一错误处理
7. **按钮实现**: 返回按钮用Pressable，其他按钮用TouchableOpacity
8. **数据持久化**: AsyncStorage存储用户数据，带@kangyang_前缀
9. **页面刷新**: 使用useFocusEffect自动刷新数据
10. **Toast提示**: 使用Tamagui useToastController

## 📱 支持平台

- **iOS**: 13.0+
- **Android**: API Level 21+
- **Web**: 现代浏览器支持

## 🔐 安全特性

- AsyncStorage本地数据持久化
- JWT Token安全管理
- 用户数据命名空间隔离（@kangyang_前缀）
- 健康数据隐私保护
- 生物识别认证支持（规划中）

## 🎨 设计主题

**AzurePop主题配色方案**:
- 主色调: `#c855f0` (蓝紫色) - 偏蓝的紫色，科技感强
- 辅助色: `#f461e0` (浅洋红) - Tab选中状态专用色
- 次要色: `#89fffd` (薄荷青) - AzurePop终点色，清新感
- 渐变组合: 完整的AzurePop渐变色体系
- 健康数据专色: 8种不同生理指标的专用颜色

## 📚 相关文档

- [开发指南](./CLAUDE.md)
- [任务规划](./app-todo.md)
- [架构设计](./康养APP产品技术架构设计.md)

---

**重要提醒**: 该应用处理敏感的健康数据，开发过程中务必遵循数据安全和隐私保护最佳实践。