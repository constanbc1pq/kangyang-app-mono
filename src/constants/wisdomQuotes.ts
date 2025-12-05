/**
 * 国学名句常量
 * 来源：易经、诗经、黄帝内经、道德经、论语等国学经典
 */

export interface WisdomQuote {
  text: string;
  source: string;
}

/**
 * 国学名句列表
 */
export const WISDOM_QUOTES: WisdomQuote[] = [
  // 黄帝内经 - 养生
  { text: '上古之人，其知道者，法于阴阳，和于术数', source: '《黄帝内经》' },
  { text: '恬淡虚无，真气从之，精神内守，病安从来', source: '《黄帝内经》' },
  { text: '春夏养阳，秋冬养阴', source: '《黄帝内经》' },
  { text: '饮食有节，起居有常，不妄作劳', source: '《黄帝内经》' },
  { text: '正气存内，邪不可干', source: '《黄帝内经》' },
  { text: '心者，君主之官也，神明出焉', source: '《黄帝内经》' },
  { text: '食饮有节，起居有常', source: '《黄帝内经》' },
  { text: '智者之养生也，必顺四时而适寒暑', source: '《黄帝内经》' },

  // 道德经 - 处世
  { text: '上善若水，水善利万物而不争', source: '《道德经》' },
  { text: '致虚极，守静笃', source: '《道德经》' },
  { text: '知足不辱，知止不殆，可以长久', source: '《道德经》' },
  { text: '大道至简，知易行难', source: '《道德经》' },
  { text: '祸兮福之所倚，福兮祸之所伏', source: '《道德经》' },
  { text: '千里之行，始于足下', source: '《道德经》' },
  { text: '天之道，损有余而补不足', source: '《道德经》' },
  { text: '柔弱胜刚强', source: '《道德经》' },

  // 易经 - 智慧
  { text: '天行健，君子以自强不息', source: '《易经》' },
  { text: '地势坤，君子以厚德载物', source: '《易经》' },
  { text: '积善之家，必有余庆', source: '《易经》' },
  { text: '穷则变，变则通，通则久', source: '《易经》' },
  { text: '君子藏器于身，待时而动', source: '《易经》' },
  { text: '一阴一阳之谓道', source: '《易经》' },

  // 论语 - 修身
  { text: '学而时习之，不亦说乎', source: '《论语》' },
  { text: '己所不欲，勿施于人', source: '《论语》' },
  { text: '三人行，必有我师焉', source: '《论语》' },
  { text: '知之者不如好之者，好之者不如乐之者', source: '《论语》' },
  { text: '温故而知新，可以为师矣', source: '《论语》' },
  { text: '君子坦荡荡，小人长戚戚', source: '《论语》' },

  // 诗经 - 生活
  { text: '靡不有初，鲜克有终', source: '《诗经》' },
  { text: '他山之石，可以攻玉', source: '《诗经》' },
  { text: '如切如磋，如琢如磨', source: '《诗经》' },
  { text: '桃之夭夭，灼灼其华', source: '《诗经》' },

  // 礼记 - 养生
  { text: '凡事豫则立，不豫则废', source: '《礼记》' },
  { text: '博学之，审问之，慎思之，明辨之，笃行之', source: '《礼记》' },

  // 庄子 - 逍遥
  { text: '人生天地之间，若白驹之过隙，忽然而已', source: '《庄子》' },
  { text: '井蛙不可以语于海者，拘于虚也', source: '《庄子》' },
  { text: '吾生也有涯，而知也无涯', source: '《庄子》' },

  // 孟子 - 仁义
  { text: '天时不如地利，地利不如人和', source: '《孟子》' },
  { text: '穷则独善其身，达则兼济天下', source: '《孟子》' },
  { text: '得道者多助，失道者寡助', source: '《孟子》' },

  // 其他经典
  { text: '宠辱不惊，闲看庭前花开花落', source: '《菜根谭》' },
  { text: '去留无意，漫随天外云卷云舒', source: '《菜根谭》' },
  { text: '静以修身，俭以养德', source: '《诫子书》' },
  { text: '非淡泊无以明志，非宁静无以致远', source: '《诫子书》' },
];

/**
 * 获取随机名句
 */
export const getRandomQuote = (): WisdomQuote => {
  const index = Math.floor(Math.random() * WISDOM_QUOTES.length);
  return WISDOM_QUOTES[index];
};

/**
 * 根据日期获取名句（每天固定一句）
 */
export const getDailyQuote = (): WisdomQuote => {
  const today = new Date();
  const dayOfYear = Math.floor(
    (today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) /
      (1000 * 60 * 60 * 24)
  );
  const index = dayOfYear % WISDOM_QUOTES.length;
  return WISDOM_QUOTES[index];
};
