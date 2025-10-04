import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, UserCommunityData } from '@/types/community';

const STORAGE_KEY = '@kangyang_community_data';

// Mock文章数据
const mockArticles: Article[] = [
  {
    id: '1',
    title: '冬季流感高发期，如何科学预防？',
    summary: '随着气温下降，流感病毒活跃度增加。专家提醒，做好个人防护，增强免疫力是关键。',
    content: `## 冬季流感高发的原因

随着气温的逐渐下降，我们迎来了流感的高发季节。流感病毒在低温环境下更加活跃，加上冬季人们多在室内活动，空气流通不畅，这些因素都增加了流感传播的风险。

### 主要传播途径

1. **飞沫传播**：患者咳嗽、打喷嚏时产生的飞沫
2. **接触传播**：接触被病毒污染的物品表面
3. **空气传播**：在密闭空间内通过空气传播

## 科学预防措施

### 1. 接种流感疫苗

接种流感疫苗是预防流感最有效的方法。建议每年秋季接种，特别是老年人、儿童和慢性病患者等高危人群。

### 2. 保持良好的个人卫生习惯

- 勤洗手，使用肥皂和流动水洗手至少20秒
- 避免用手触摸眼睛、鼻子和嘴巴
- 咳嗽或打喷嚏时用纸巾或肘部遮挡

### 3. 增强免疫力

- **均衡饮食**：多吃新鲜蔬菜水果，补充维生素C
- **适量运动**：每天坚持30分钟中等强度运动
- **充足睡眠**：保证每天7-8小时睡眠
- **减少压力**：学会放松，保持良好心态

### 4. 保持环境卫生

- 定期开窗通风，保持室内空气流通
- 定期清洁消毒常接触的物品表面
- 避免去人群密集、空气不流通的场所

## 出现症状怎么办

如果出现发热、咳嗽、喉咙痛等流感症状，应该：

1. 及时就医，不要自行用药
2. 在家休息，避免外出传染他人
3. 多喝水，保持充足休息
4. 按医嘱服药，完成治疗疗程

**重要提示**：流感与普通感冒不同，症状更严重，传染性更强。如果症状持续加重或出现呼吸困难、持续高热等情况，应立即就医。`,
    author: {
      id: 'author1',
      name: '健康时报',
      title: '专业健康媒体',
      verified: true,
      followers: 12456,
      articles: 234,
    },
    publishTime: '2024-01-15 10:30',
    readTime: '3分钟',
    views: 1234,
    likes: 89,
    shares: 23,
    comments: 15,
    category: '疾病预防',
    tags: ['流感预防', '冬季健康', '免疫力'],
  },
  {
    id: '2',
    title: '血压管理：家庭自测血压的正确方法',
    summary: '高血压是常见的慢性病，正确的家庭血压监测对疾病管理至关重要。本文详细介绍家庭自测血压的注意事项。',
    content: `## 为什么需要家庭血压监测

家庭血压监测能够：
- 更准确地反映日常血压水平
- 避免"白大衣高血压"现象
- 及时发现血压波动
- 评估降压药物效果

## 测量前的准备

### 1. 选择合适的血压计

- 推荐使用上臂式电子血压计
- 确保血压计经过校准
- 选择袖带尺寸合适的设备

### 2. 测量时机

- 早晨起床后，服药前
- 晚上就寝前
- 排空膀胱，休息5-10分钟后测量

### 3. 测量姿势

- 坐位，背部有支撑
- 上臂与心脏保持同一水平
- 双脚平放地面
- 保持安静，不说话

## 测量步骤

1. 裸露上臂，袖带下缘距肘窝2-3厘米
2. 袖带松紧适宜，能插入1-2指
3. 静坐2分钟后开始测量
4. 连续测量2-3次，取平均值
5. 记录测量时间、数值和心率

## 结果判读

- 正常血压：<120/80 mmHg
- 正常高值：120-139/80-89 mmHg
- 高血压1级：140-159/90-99 mmHg
- 高血压2级：160-179/100-109 mmHg
- 高血压3级：≥180/110 mmHg

## 注意事项

- 测量前30分钟避免吸烟、饮酒、喝咖啡
- 测量前避免剧烈运动
- 紧张、焦虑时不宜测量
- 定期校准血压计
- 异常结果应咨询医生`,
    author: {
      id: 'author2',
      name: '王医师',
      title: '心血管内科主任医师',
      verified: true,
      followers: 8934,
      articles: 156,
    },
    publishTime: '2024-01-14 14:20',
    readTime: '5分钟',
    views: 2156,
    likes: 134,
    shares: 45,
    comments: 28,
    category: '慢病管理',
    tags: ['高血压', '血压监测', '家庭护理'],
  },
  {
    id: '3',
    title: '老年人跌倒预防指南：居家安全措施',
    summary: '跌倒是老年人常见的意外伤害，可能导致严重后果。了解跌倒风险因素，采取预防措施至关重要。',
    content: `## 老年人跌倒的危害

跌倒可能导致：
- 骨折（尤其是髋部骨折）
- 头部外伤
- 软组织损伤
- 心理阴影和恐惧
- 活动能力下降

## 跌倒的常见原因

### 内在因素

- 平衡功能下降
- 肌肉力量减弱
- 视力下降
- 服用多种药物
- 慢性疾病影响

### 环境因素

- 地面湿滑或不平
- 光线不足
- 障碍物过多
- 缺乏扶手
- 不合适的鞋子

## 居家安全改造

### 1. 浴室改造

- 安装防滑垫和扶手
- 使用淋浴椅
- 保持地面干燥
- 夜间使用小夜灯

### 2. 卧室安全

- 床高适中，易于上下
- 床边放置台灯
- 移除电线和杂物
- 使用防滑地毯

### 3. 客厅和走廊

- 保持通道畅通
- 固定地毯边缘
- 楼梯安装扶手和防滑条
- 充足照明

### 4. 厨房安全

- 常用物品放在易取位置
- 使用稳固的踏凳
- 及时清理溢出物
- 保持地面干燥

## 日常预防措施

### 运动锻炼

- 太极拳改善平衡
- 力量训练增强肌肉
- 步行提高协调性
- 定期健身操

### 生活习惯

- 穿合脚防滑鞋
- 避免突然起身
- 使用助行器
- 定期检查视力

### 药物管理

- 了解药物副作用
- 避免药物相互作用
- 定期复查用药
- 及时调整剂量

## 跌倒后的处理

1. 保持冷静，不要急于起身
2. 检查是否受伤
3. 寻求帮助
4. 如有严重疼痛或无法活动，呼叫120
5. 事后就医检查

**预防跌倒需要全家人的共同努力，为老年人创造安全的生活环境。**`,
    author: {
      id: 'author3',
      name: '李护士',
      title: '老年护理专家',
      verified: true,
      followers: 5678,
      articles: 89,
    },
    publishTime: '2024-01-13 09:15',
    readTime: '6分钟',
    views: 3421,
    likes: 267,
    shares: 89,
    comments: 56,
    category: '老年健康',
    tags: ['跌倒预防', '居家安全', '老年护理'],
  },
  {
    id: '4',
    title: '糖尿病患者的饮食原则与实用建议',
    summary: '合理的饮食控制是糖尿病管理的基石。掌握科学的饮食原则，有助于稳定血糖，提高生活质量。',
    content: `## 糖尿病饮食的基本原则

### 1. 控制总热量

- 根据体重和活动量确定每日热量需求
- 超重者需减少热量摄入
- 避免暴饮暴食
- 定时定量进餐

### 2. 合理分配三大营养素

- **碳水化合物**：占总热量50-60%
- **蛋白质**：占总热量15-20%
- **脂肪**：占总热量25-30%

### 3. 选择优质食物

- 多吃全谷物和粗粮
- 增加蔬菜摄入
- 适量优质蛋白
- 限制饱和脂肪

## 推荐食物清单

### 主食类

- ✅ 燕麦、荞麦、糙米
- ✅ 全麦面包
- ✅ 红薯、山药
- ❌ 精白米面
- ❌ 油炸主食

### 蔬菜类

- ✅ 绿叶蔬菜（菠菜、油菜）
- ✅ 瓜类（黄瓜、冬瓜）
- ✅ 菌菇类
- ⚠️ 土豆、芋头（当主食）

### 蛋白质

- ✅ 鱼虾
- ✅ 鸡蛋白
- ✅ 瘦肉
- ✅ 豆制品
- ❌ 肥肉、动物内脏

### 水果

- ✅ 苹果、梨、柚子
- ✅ 草莓、蓝莓
- ⚠️ 在两餐之间食用
- ❌ 榴莲、荔枝（高糖）

## 实用饮食技巧

### 1. 餐前准备

- 准备食物秤和量具
- 先吃蔬菜再吃主食
- 每餐蔬菜占1/2

### 2. 烹饪方法

- 推荐：蒸、煮、炖、烤
- 少用油炸、爆炒
- 少用糖、盐调味
- 使用天然香料

### 3. 进餐习惯

- 细嚼慢咽，每口咀嚼20次
- 七八分饱即可
- 固定进餐时间
- 少食多餐

## 外出就餐建议

- 选择清蒸、白灼菜品
- 要求少油少盐
- 主食选择粗粮
- 避免勾芡菜品
- 不喝含糖饮料

## 血糖监测与饮食调整

- 餐前血糖：4.4-7.0 mmol/L
- 餐后2小时：<10.0 mmol/L
- 根据血糖值调整饮食
- 记录饮食日记

**温馨提示**：每位糖尿病患者的情况不同，应在医生和营养师指导下制定个性化饮食方案。`,
    author: {
      id: 'author4',
      name: '张营养师',
      title: '注册营养师',
      verified: true,
      followers: 9821,
      articles: 178,
    },
    publishTime: '2024-01-12 16:45',
    readTime: '7分钟',
    views: 4532,
    likes: 398,
    shares: 127,
    comments: 89,
    category: '营养饮食',
    tags: ['糖尿病', '饮食控制', '血糖管理'],
  },
  {
    id: '5',
    title: '冬季养生：中医教你如何科学进补',
    summary: '冬季是进补的最佳时节，但如何科学进补却大有学问。本文从中医角度为您解读冬季养生之道。',
    content: `## 冬季进补的中医理论

《黄帝内经》曰："冬三月，此谓闭藏"。冬季是收藏的季节，适合进补养生。

### 为什么冬季要进补

- 顺应自然规律
- 增强抵抗力
- 为春天生发做准备
- 改善体质

## 进补原则

### 1. 因人而异

不同体质需要不同的进补方法：

**阳虚体质**
- 特征：怕冷、手脚凉
- 进补：温补阳气
- 食材：羊肉、韭菜、核桃

**阴虚体质**
- 特征：手脚心热、口干
- 进补：滋阴润燥
- 食材：百合、银耳、梨

**气虚体质**
- 特征：乏力、易感冒
- 进补：补气健脾
- 食材：山药、大枣、黄芪

**血虚体质**
- 特征：面色苍白、头晕
- 进补：补血养血
- 食材：阿胶、红枣、桂圆

### 2. 循序渐进

- 先调理脾胃
- 从清补开始
- 逐渐增强
- 不可过量

### 3. 辨证施补

- 虚则补之
- 实则泻之
- 寒者热之
- 热者寒之

## 冬季养生食疗方

### 1. 当归生姜羊肉汤

**功效**：温中补虚，祛寒止痛

**材料**：
- 羊肉500g
- 当归20g
- 生姜30g
- 调料适量

**做法**：
1. 羊肉洗净切块，焯水去腥
2. 加入当归、生姜
3. 小火炖煮2小时
4. 加盐调味即可

**适合**：阳虚怕冷者

### 2. 山药枸杞粥

**功效**：补脾益肾，滋阴润燥

**材料**：
- 山药100g
- 枸杞15g
- 大米50g

**做法**：
1. 山药去皮切块
2. 大米淘洗干净
3. 一起煮粥
4. 粥成加枸杞即可

**适合**：脾胃虚弱者

### 3. 银耳莲子羹

**功效**：滋阴润肺，养心安神

**材料**：
- 银耳20g
- 莲子30g
- 冰糖适量

**做法**：
1. 银耳泡发撕小朵
2. 莲子去芯
3. 一起炖煮1小时
4. 加冰糖调味

**适合**：阴虚内热者

## 冬季起居养生

### 1. 早睡晚起

- 顺应冬藏之气
- 保证充足睡眠
- 避免过度劳累

### 2. 保暖防寒

- 注意头部保暖
- 护好腰背
- 避免受凉

### 3. 适度运动

- 选择温和运动
- 避免大汗淋漓
- 室内运动为宜

### 4. 情志调养

- 保持心情平和
- 避免过度兴奋
- 适当娱乐活动

## 进补注意事项

1. 体质偏热者不宜温补
2. 感冒发烧时停止进补
3. 消化不良者先调脾胃
4. 进补同时注意运动
5. 保持心情愉悦

**温馨提示**：进补前最好咨询中医师，根据个人体质制定方案。盲目进补可能适得其反。`,
    author: {
      id: 'author5',
      name: '陈医师',
      title: '中医养生专家',
      verified: true,
      followers: 15234,
      articles: 267,
    },
    publishTime: '2024-01-11 11:20',
    readTime: '8分钟',
    views: 5678,
    likes: 456,
    shares: 178,
    comments: 123,
    category: '中医养生',
    tags: ['冬季养生', '中医', '进补'],
  },
];

// 获取用户社区数据
async function getUserCommunityData(): Promise<UserCommunityData> {
  try {
    const data = await AsyncStorage.getItem(STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load community data:', error);
  }

  return {
    bookmarkedArticles: [],
    likedArticles: [],
    joinedCircles: [],
    followedTopics: [],
    circlePostLikes: [],
    commentLikes: [],
  };
}

// 保存用户社区数据
async function saveUserCommunityData(data: UserCommunityData): Promise<void> {
  try {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to save community data:', error);
  }
}

// 获取所有文章
export async function getArticles(): Promise<Article[]> {
  const userData = await getUserCommunityData();

  return mockArticles.map(article => ({
    ...article,
    isBookmarked: userData.bookmarkedArticles.includes(article.id),
    isLiked: userData.likedArticles.includes(article.id),
  }));
}

// 根据ID获取文章
export async function getArticleById(id: string): Promise<Article | null> {
  const articles = await getArticles();
  return articles.find(article => article.id === id) || null;
}

// 根据分类获取文章
export async function getArticlesByCategory(category: string): Promise<Article[]> {
  const articles = await getArticles();
  if (category === '全部') {
    return articles;
  }
  return articles.filter(article => article.category === category);
}

// 收藏文章
export async function toggleBookmarkArticle(articleId: string): Promise<boolean> {
  const userData = await getUserCommunityData();
  const index = userData.bookmarkedArticles.indexOf(articleId);

  if (index > -1) {
    userData.bookmarkedArticles.splice(index, 1);
  } else {
    userData.bookmarkedArticles.push(articleId);
  }

  await saveUserCommunityData(userData);
  return index === -1; // 返回新的收藏状态
}

// 点赞文章
export async function toggleLikeArticle(articleId: string): Promise<boolean> {
  const userData = await getUserCommunityData();
  const index = userData.likedArticles.indexOf(articleId);

  if (index > -1) {
    userData.likedArticles.splice(index, 1);
  } else {
    userData.likedArticles.push(articleId);
  }

  await saveUserCommunityData(userData);
  return index === -1; // 返回新的点赞状态
}

// 搜索文章
export async function searchArticles(query: string): Promise<Article[]> {
  const articles = await getArticles();
  const lowerQuery = query.toLowerCase();

  return articles.filter(article =>
    article.title.toLowerCase().includes(lowerQuery) ||
    article.summary.toLowerCase().includes(lowerQuery) ||
    article.tags.some(tag => tag.toLowerCase().includes(lowerQuery))
  );
}

export const articleService = {
  getArticles,
  getArticleById,
  getArticlesByCategory,
  toggleBookmarkArticle,
  toggleLikeArticle,
  searchArticles,
};
