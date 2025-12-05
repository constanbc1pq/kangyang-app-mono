import AsyncStorage from '@react-native-async-storage/async-storage';
import { Article, UserCommunityData } from '@/types/community';

const STORAGE_KEY = '@kangyang_community_data';
const ARTICLES_STORAGE_KEY = '@kangyang_user_articles';
const DRAFTS_STORAGE_KEY = '@kangyang_article_drafts';

// 草稿类型
export interface ArticleDraft {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: string;
  tags: string[];
  coverImage?: string;
  images?: string[];
  savedAt: string;
}

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
  {
    id: '6',
    title: '春季养肝正当时：疏肝理气的中医调养法',
    summary: '中医认为春季属木，与肝相应。春季养生重在养肝，疏肝理气，保持情志舒畅。',
    content: `## 春季养肝的重要性

春季万物生发，人体阳气上升，肝气旺盛。如果调养不当，容易出现肝气郁结、肝火上炎等问题。

### 肝的主要功能
- 疏泄情志
- 调畅气机
- 藏血养血
- 主筋华爪

## 春季肝气郁结的表现

- 情绪烦躁易怒
- 胸胁胀痛
- 失眠多梦
- 头晕头痛
- 口苦咽干

## 疏肝理气的方法

### 1. 饮食调养

**推荐食物**：
- 青色蔬菜：菠菜、芹菜、韭菜
- 疏肝食材：玫瑰花、陈皮、佛手
- 养肝食材：枸杞、大枣、桑葚

**忌食**：
- 辛辣刺激食物
- 油腻肥甘
- 过度饮酒

### 2. 情志调养

- 保持心情舒畅
- 避免郁怒伤肝
- 适当宣泄情绪
- 培养兴趣爱好

### 3. 运动锻炼

- 散步、慢跑
- 太极拳
- 八段锦
- 瑜伽

### 4. 穴位按摩

**太冲穴**：位于足背第一、二趾间
- 每天按摩3-5分钟
- 疏肝解郁、平肝潜阳

**期门穴**：位于乳头下方第六肋间
- 轻柔按摩
- 疏肝理气、和胃止痛

## 疏肝理气茶饮

### 玫瑰陈皮茶

**材料**：玫瑰花5克，陈皮3克
**做法**：开水冲泡，代茶饮
**功效**：疏肝解郁，理气和中

### 柴胡薄荷茶

**材料**：柴胡6克，薄荷3克
**做法**：开水冲泡10分钟
**功效**：疏肝清热，提神醒脑`,
    author: {
      id: 'author6',
      name: '赵中医',
      title: '中医内科主任医师',
      verified: true,
      followers: 11234,
      articles: 198,
    },
    publishTime: '2024-01-10 10:00',
    readTime: '5分钟',
    views: 3456,
    likes: 278,
    shares: 95,
    comments: 67,
    category: '中医养生',
    tags: ['春季养生', '养肝', '疏肝理气'],
  },
  {
    id: '7',
    title: '骨质疏松预防：中老年人的骨骼健康指南',
    summary: '骨质疏松是老年人常见问题，了解预防方法，从年轻开始储备骨量，对老年健康至关重要。',
    content: `## 什么是骨质疏松

骨质疏松是一种以骨量减少、骨组织微结构破坏为特征的全身性骨病，导致骨脆性增加，易发生骨折。

### 高危人群

- 绝经后女性
- 老年人（>65岁）
- 长期卧床者
- 长期服用激素者
- 有家族史者

## 预防措施

### 1. 饮食营养

**钙的摄入**：
- 成人：800-1000mg/天
- 老年人：1000-1200mg/天
- 食物来源：牛奶、豆制品、海产品

**维生素D补充**：
- 每日400-800IU
- 多晒太阳
- 补充鱼肝油

**蛋白质**：
- 适量摄入优质蛋白
- 鱼、蛋、瘦肉、豆类

### 2. 运动锻炼

**负重运动**：
- 快走、慢跑
- 爬楼梯
- 舞蹈

**抗阻运动**：
- 举哑铃
- 弹力带训练
- 俯卧撑

**平衡训练**：
- 单脚站立
- 太极拳
- 瑜伽

### 3. 生活习惯

- 戒烟限酒
- 避免久坐
- 防止跌倒
- 定期体检

## 骨密度检测

### 检测时机

- 女性65岁以上
- 男性70岁以上
- 绝经后女性有危险因素
- 有脆性骨折史

### 结果判读

- T值≥-1.0：正常
- -2.5<T值<-1.0：骨量减少
- T值≤-2.5：骨质疏松

## 药物治疗

需在医生指导下使用：
- 钙剂和维生素D
- 双膦酸盐类药物
- 降钙素
- 雌激素替代治疗（女性）

**重要提示**：预防骨质疏松应从年轻时开始，积极储备骨量，保持健康生活方式。`,
    author: {
      id: 'author7',
      name: '刘医师',
      title: '骨科主任医师',
      verified: true,
      followers: 7890,
      articles: 145,
    },
    publishTime: '2024-01-09 15:30',
    readTime: '6分钟',
    views: 4123,
    likes: 325,
    shares: 112,
    comments: 78,
    category: '老年健康',
    tags: ['骨质疏松', '骨骼健康', '预防保健'],
  },
  {
    id: '8',
    title: '慢性肾病的早期信号与日常管理',
    summary: '慢性肾病起病隐匿，早期发现和规范治疗对延缓疾病进展至关重要。了解早期信号，重视肾脏保护。',
    content: `## 慢性肾病的早期信号

### 尿液异常
- 泡沫尿（蛋白尿）
- 血尿
- 尿量改变
- 夜尿增多

### 全身症状
- 乏力、疲倦
- 食欲不振
- 恶心呕吐
- 皮肤瘙痒

### 水肿
- 眼睑浮肿
- 下肢水肿
- 全身水肿

### 血压升高
- 难以控制的高血压
- 清晨高血压

## 日常管理要点

### 1. 饮食管理

**蛋白质控制**：
- 早期：0.8g/kg/天
- 中晚期：0.6g/kg/天
- 优质蛋白为主

**盐分限制**：
- 轻度：<6g/天
- 中重度：<3g/天

**钾的控制**：
- 避免高钾食物
- 少吃香蕉、橙子
- 蔬菜焯水后食用

**磷的限制**：
- 控制乳制品
- 限制坚果
- 避免加工食品

### 2. 血压管理

- 目标：<130/80 mmHg
- 规律服药
- 定期监测
- 避免自行停药

### 3. 血糖控制

- 糖尿病肾病患者尤为重要
- 糖化血红蛋白<7%
- 预防低血糖

### 4. 药物注意

**慎用药物**：
- 非甾体抗炎药
- 某些抗生素
- 造影剂

**用药原则**：
- 遵医嘱用药
- 调整药物剂量
- 定期复查肾功能

## 定期检查

### 必查项目
- 尿常规
- 肾功能（肌酐、尿素氮）
- 电解质
- 肾小球滤过率（eGFR）

### 检查频率
- 1-2期：3-6个月
- 3期：3个月
- 4-5期：1-3个月

## 生活方式

- 戒烟限酒
- 适量运动
- 充足休息
- 避免感染
- 保持良好心态

**重要提醒**：出现早期信号应及时就医，规范治疗可有效延缓肾病进展。`,
    author: {
      id: 'author8',
      name: '周医师',
      title: '肾内科主任医师',
      verified: true,
      followers: 6789,
      articles: 132,
    },
    publishTime: '2024-01-08 09:45',
    readTime: '7分钟',
    views: 3890,
    likes: 298,
    shares: 87,
    comments: 65,
    category: '慢病管理',
    tags: ['慢性肾病', '肾脏保护', '疾病管理'],
  },
  {
    id: '9',
    title: '肺炎预防全攻略：保护呼吸系统健康',
    summary: '肺炎是常见的呼吸系统感染性疾病，尤其对老年人和免疫力低下者威胁较大。科学预防，守护肺部健康。',
    content: `## 肺炎的类型与危害

### 常见类型
- 细菌性肺炎
- 病毒性肺炎
- 支原体肺炎
- 吸入性肺炎

### 高危人群
- 65岁以上老年人
- 慢性病患者
- 免疫功能低下者
- 长期卧床者
- 吸烟者

## 预防措施

### 1. 接种疫苗

**肺炎球菌疫苗**：
- 23价多糖疫苗（PPV23）
- 13价结合疫苗（PCV13）
- 老年人和慢性病患者优先接种

**流感疫苗**：
- 每年秋季接种
- 预防流感继发肺炎
- 降低重症风险

### 2. 增强免疫力

**均衡饮食**：
- 充足蛋白质摄入
- 多吃新鲜蔬果
- 补充维生素A、C、E
- 适量补充锌和硒

**规律运动**：
- 每周5次，每次30分钟
- 有氧运动为主
- 改善心肺功能
- 增强抵抗力

**充足睡眠**：
- 保证7-8小时睡眠
- 提高免疫功能
- 促进身体修复

### 3. 保持呼吸道健康

**戒烟限酒**：
- 吸烟损伤呼吸道黏膜
- 降低防御能力
- 增加感染风险

**鼻腔清洁**：
- 用生理盐水冲洗
- 保持鼻腔湿润
- 减少病原体入侵

**避免空气污染**：
- 雾霾天减少外出
- 室内使用空气净化器
- 定期通风换气

### 4. 个人卫生习惯

- 勤洗手，用肥皂和流水
- 咳嗽打喷嚏掩口鼻
- 避免用手触摸口鼻
- 不随地吐痰
- 定期更换牙刷

### 5. 避免交叉感染

- 流感季节少去人群密集场所
- 接触患者戴口罩
- 与患者保持距离
- 患者使用的物品单独清洗消毒

## 早期识别肺炎

### 典型症状
- 发热（常>38°C）
- 咳嗽、咳痰
- 胸痛
- 呼吸困难
- 乏力

### 老年人非典型表现
- 无发热或低热
- 精神萎靡
- 食欲下降
- 意识障碍
- 原有疾病加重

## 就医指征

出现以下情况应立即就医：
- 持续高热不退
- 呼吸急促或困难
- 胸痛明显
- 咳血
- 意识改变
- 血氧饱和度下降

## 慢性病患者特别注意

**糖尿病患者**：
- 控制血糖
- 监测感染征兆
- 及时调整用药

**心肺疾病患者**：
- 规律服药
- 定期复查
- 避免病情加重

**免疫抑制患者**：
- 加强防护
- 密切观察
- 预防性用药

**温馨提示**：预防肺炎，从日常做起。接种疫苗、增强体质、保持卫生是关键。出现症状及时就医，切勿延误治疗。`,
    author: {
      id: 'author9',
      name: '吴医师',
      title: '呼吸内科主任医师',
      verified: true,
      followers: 10234,
      articles: 203,
    },
    publishTime: '2024-01-07 08:30',
    readTime: '6分钟',
    views: 4567,
    likes: 367,
    shares: 134,
    comments: 91,
    category: '疾病预防',
    tags: ['肺炎预防', '呼吸健康', '疫苗接种'],
  },
  {
    id: '10',
    title: '科学补钙：不同年龄段的钙质需求指南',
    summary: '钙是人体必需的矿物质，对骨骼健康至关重要。了解不同年龄段的钙质需求，科学补钙，预防骨质疏松。',
    content: `## 钙的重要性

### 钙的主要功能
- 构建骨骼和牙齿
- 维持神经传导
- 调节肌肉收缩
- 参与血液凝固
- 调节酶的活性

### 缺钙的危害
- 儿童：生长发育迟缓、佝偻病
- 青少年：骨骼发育不良
- 成人：骨质疏松、腰腿疼痛
- 孕妇：妊娠高血压、骨质流失
- 老年人：骨折风险增加

## 不同年龄段的钙需求

### 婴幼儿（0-3岁）
- 0-6个月：200mg/天
- 7-12个月：250mg/天
- 1-3岁：600mg/天
- 主要来源：母乳、配方奶

### 儿童青少年（4-18岁）
- 4-8岁：800mg/天
- 9-18岁：1000-1200mg/天
- 关键期：骨骼快速生长
- 补钙重点：储备骨量

### 成人（19-50岁）
- 推荐摄入：800-1000mg/天
- 孕妇：1000-1200mg/天
- 哺乳期：1200-1500mg/天
- 维持期：保持骨量

### 老年人（50岁以上）
- 绝经后女性：1200mg/天
- 老年男性：1000mg/天
- 重点：预防骨质疏松

## 富含钙的食物

### 乳制品（钙含量高，吸收好）
- 牛奶：100mg/100ml
- 酸奶：120mg/100g
- 奶酪：700mg/100g
- 建议：每天300ml奶制品

### 豆制品
- 豆腐：160mg/100g
- 豆干：300mg/100g
- 豆浆：10mg/100ml
- 黑豆：200mg/100g

### 绿叶蔬菜
- 芥蓝：238mg/100g
- 苋菜：180mg/100g
- 小白菜：90mg/100g
- 注意：草酸含量高的需焯水

### 海产品
- 虾皮：991mg/100g
- 海带：241mg/100g
- 紫菜：264mg/100g
- 小鱼干：2000mg/100g

### 坚果种子
- 芝麻：620mg/100g
- 杏仁：270mg/100g
- 榛子：190mg/100g

## 促进钙吸收的方法

### 1. 补充维生素D
- 晒太阳：每天15-30分钟
- 食物来源：鱼肝油、蛋黄、深海鱼
- 补充剂：每日400-800IU

### 2. 适量运动
- 负重运动促进钙沉积
- 增强骨密度
- 改善平衡能力

### 3. 合理搭配
- 钙与维生素K同补
- 适量蛋白质
- 控制盐分摄入

## 补钙的注意事项

### 影响钙吸收的因素

**促进吸收**：
- 维生素D
- 乳糖
- 适量蛋白质
- 维生素C

**抑制吸收**：
- 草酸（菠菜、竹笋）
- 植酸（全谷物）
- 过多膳食纤维
- 高盐饮食
- 咖啡、浓茶

### 钙补充剂选择

**常见类型**：
- 碳酸钙：含钙量高（40%），需随餐服用
- 柠檬酸钙：吸收好，空腹可服
- 乳酸钙：含钙量低（13%），易吸收
- 葡萄糖酸钙：温和，适合儿童

**服用建议**：
- 分次服用（每次≤500mg）
- 睡前服用吸收好
- 避免与铁、锌同服
- 不超过推荐剂量

### 补钙误区

❌ **误区1**：骨头汤补钙
- 实际含钙量很低
- 脂肪含量高
- 不如喝牛奶

❌ **误区2**：补钙越多越好
- 过量增加肾结石风险
- 影响其他矿物质吸收
- 遵循推荐摄入量

❌ **误区3**：只靠补充剂
- 食补为主，补充剂为辅
- 天然食物营养更全面
- 吸收利用率更高

## 特殊人群补钙

### 孕妇
- 孕中晚期需求增加
- 预防妊娠高血压
- 保障胎儿发育

### 哺乳期
- 每天流失300mg
- 及时补充防骨质流失
- 保证乳汁质量

### 更年期女性
- 雌激素下降影响钙吸收
- 骨质流失加速
- 需增加钙摄入

### 素食者
- 缺乏乳制品
- 注意豆制品、绿叶菜
- 可能需要补充剂

**健康提示**：科学补钙，食补为主，必要时在医生指导下使用钙补充剂。定期检查骨密度，及时调整补钙方案。`,
    author: {
      id: 'author10',
      name: '孙营养师',
      title: '临床营养师',
      verified: true,
      followers: 13456,
      articles: 245,
    },
    publishTime: '2024-01-06 13:20',
    readTime: '8分钟',
    views: 5234,
    likes: 421,
    shares: 156,
    comments: 102,
    category: '营养饮食',
    tags: ['补钙', '骨骼健康', '营养指南'],
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

// 获取所有文章（合并 mock 数据和用户创建的文章）
export async function getArticles(): Promise<Article[]> {
  const userData = await getUserCommunityData();
  const userArticles = await getUserArticles();

  // 合并用户文章和 mock 文章，用户文章排在前面
  const allArticles = [...userArticles, ...mockArticles];

  return allArticles.map(article => ({
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

// ==================== 用户创建的文章 ====================

// 获取用户创建的文章
async function getUserArticles(): Promise<Article[]> {
  try {
    const data = await AsyncStorage.getItem(ARTICLES_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load user articles:', error);
  }
  return [];
}

// 保存用户创建的文章
async function saveUserArticles(articles: Article[]): Promise<void> {
  try {
    await AsyncStorage.setItem(ARTICLES_STORAGE_KEY, JSON.stringify(articles));
  } catch (error) {
    console.error('Failed to save user articles:', error);
  }
}

// 创建文章
export async function createArticle(data: {
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  images?: string[];
}): Promise<Article> {
  const userArticles = await getUserArticles();
  const now = new Date();

  // 生成摘要：如果没有提供，从内容中截取
  const summary = data.summary || data.content.substring(0, 100).replace(/[#*\n]/g, '').trim() + '...';

  // 计算阅读时长（约 300 字/分钟）
  const wordCount = data.content.length;
  const readMinutes = Math.max(1, Math.ceil(wordCount / 300));

  const newArticle: Article = {
    id: `user_article_${Date.now()}`,
    title: data.title,
    summary,
    content: data.content,
    author: {
      id: 'user_current',
      name: '我',
      title: '社区用户',
      verified: false,
      followers: 0,
      articles: userArticles.length + 1,
    },
    publishTime: `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    readTime: `${readMinutes}分钟`,
    views: 0,
    likes: 0,
    shares: 0,
    comments: 0,
    category: data.category,
    tags: data.tags,
    image: data.coverImage,
  };

  // 将新文章添加到用户文章列表开头
  userArticles.unshift(newArticle);
  await saveUserArticles(userArticles);

  return newArticle;
}

// ==================== 草稿功能 ====================

// 获取所有草稿
export async function getDrafts(): Promise<ArticleDraft[]> {
  try {
    const data = await AsyncStorage.getItem(DRAFTS_STORAGE_KEY);
    if (data) {
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Failed to load drafts:', error);
  }
  return [];
}

// 保存草稿
export async function saveDraft(data: {
  id?: string;
  title: string;
  content: string;
  summary?: string;
  category: string;
  tags: string[];
  coverImage?: string;
  images?: string[];
}): Promise<ArticleDraft> {
  const drafts = await getDrafts();
  const now = new Date().toISOString();

  // 生成摘要
  const summary = data.summary || data.content.substring(0, 100).replace(/[#*\n]/g, '').trim();

  const draft: ArticleDraft = {
    id: data.id || `draft_${Date.now()}`,
    title: data.title,
    content: data.content,
    summary,
    category: data.category,
    tags: data.tags,
    coverImage: data.coverImage,
    images: data.images,
    savedAt: now,
  };

  // 如果是更新现有草稿，先移除旧的
  const existingIndex = drafts.findIndex(d => d.id === draft.id);
  if (existingIndex > -1) {
    drafts.splice(existingIndex, 1);
  }

  // 添加到列表开头
  drafts.unshift(draft);

  try {
    await AsyncStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(drafts));
  } catch (error) {
    console.error('Failed to save draft:', error);
    throw error;
  }

  return draft;
}

// 获取单个草稿
export async function getDraftById(id: string): Promise<ArticleDraft | null> {
  const drafts = await getDrafts();
  return drafts.find(d => d.id === id) || null;
}

// 删除草稿
export async function deleteDraft(id: string): Promise<void> {
  const drafts = await getDrafts();
  const filteredDrafts = drafts.filter(d => d.id !== id);

  try {
    await AsyncStorage.setItem(DRAFTS_STORAGE_KEY, JSON.stringify(filteredDrafts));
  } catch (error) {
    console.error('Failed to delete draft:', error);
    throw error;
  }
}

// 删除用户文章
export async function deleteArticle(id: string): Promise<boolean> {
  const userArticles = await getUserArticles();
  const articleIndex = userArticles.findIndex(a => a.id === id);

  if (articleIndex === -1) {
    // 文章不存在或不是用户创建的文章
    return false;
  }

  userArticles.splice(articleIndex, 1);
  await saveUserArticles(userArticles);
  return true;
}

export const articleService = {
  getArticles,
  getArticleById,
  getArticlesByCategory,
  toggleBookmarkArticle,
  toggleLikeArticle,
  searchArticles,
  createArticle,
  deleteArticle,
  getDrafts,
  saveDraft,
  getDraftById,
  deleteDraft,
};
