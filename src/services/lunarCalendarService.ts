/**
 * 农历/节气服务
 * 提供农历日期、节气、时辰等信息
 */

// 天干
const HEAVENLY_STEMS = ['甲', '乙', '丙', '丁', '戊', '己', '庚', '辛', '壬', '癸'];
// 地支
const EARTHLY_BRANCHES = ['子', '丑', '寅', '卯', '辰', '巳', '午', '未', '申', '酉', '戌', '亥'];
// 生肖
const ZODIAC_ANIMALS = ['鼠', '牛', '虎', '兔', '龙', '蛇', '马', '羊', '猴', '鸡', '狗', '猪'];
// 农历月份
const LUNAR_MONTHS = ['正', '二', '三', '四', '五', '六', '七', '八', '九', '十', '冬', '腊'];
// 农历日期
const LUNAR_DAYS = [
  '初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
  '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '二十',
  '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',
];
// 时辰
const CHINESE_HOURS = [
  { name: '子时', range: '23:00-01:00', organ: '胆' },
  { name: '丑时', range: '01:00-03:00', organ: '肝' },
  { name: '寅时', range: '03:00-05:00', organ: '肺' },
  { name: '卯时', range: '05:00-07:00', organ: '大肠' },
  { name: '辰时', range: '07:00-09:00', organ: '胃' },
  { name: '巳时', range: '09:00-11:00', organ: '脾' },
  { name: '午时', range: '11:00-13:00', organ: '心' },
  { name: '未时', range: '13:00-15:00', organ: '小肠' },
  { name: '申时', range: '15:00-17:00', organ: '膀胱' },
  { name: '酉时', range: '17:00-19:00', organ: '肾' },
  { name: '戌时', range: '19:00-21:00', organ: '心包' },
  { name: '亥时', range: '21:00-23:00', organ: '三焦' },
];

// 24节气及其养生建议
const SOLAR_TERMS: { name: string; tip: string }[] = [
  { name: '小寒', tip: '养肾防寒，多吃温补食物' },
  { name: '大寒', tip: '注意保暖，适当进补' },
  { name: '立春', tip: '养肝护阳，少吃酸味食物' },
  { name: '雨水', tip: '调养脾胃，预防春困' },
  { name: '惊蛰', tip: '疏肝理气，适当运动' },
  { name: '春分', tip: '阴阳平衡，早睡早起' },
  { name: '清明', tip: '养肝明目，踏青舒心' },
  { name: '谷雨', tip: '祛湿健脾，适量饮茶' },
  { name: '立夏', tip: '养心安神，清淡饮食' },
  { name: '小满', tip: '清热祛湿，忌食辛辣' },
  { name: '芒种', tip: '补水防暑，午休养神' },
  { name: '夏至', tip: '养心护阳，多食苦味' },
  { name: '小暑', tip: '消暑解热，补充水分' },
  { name: '大暑', tip: '防中暑，吃清凉食物' },
  { name: '立秋', tip: '养肺润燥，早睡早起' },
  { name: '处暑', tip: '滋阴润肺，防秋燥' },
  { name: '白露', tip: '润肺养阴，防感冒' },
  { name: '秋分', tip: '阴阳平衡，养阴润燥' },
  { name: '寒露', tip: '养阴润肺，保暖防寒' },
  { name: '霜降', tip: '养胃健脾，适当进补' },
  { name: '立冬', tip: '养肾防寒，早睡晚起' },
  { name: '小雪', tip: '温补肾阳，保暖御寒' },
  { name: '大雪', tip: '养藏精气，温补为主' },
  { name: '冬至', tip: '养肾固本，温热进补' },
];

// 2024-2025年节气日期（简化版，实际应使用天文算法）
const SOLAR_TERM_DATES: Record<string, { month: number; day: number }[]> = {
  '小寒': [{ month: 1, day: 6 }],
  '大寒': [{ month: 1, day: 20 }],
  '立春': [{ month: 2, day: 4 }],
  '雨水': [{ month: 2, day: 19 }],
  '惊蛰': [{ month: 3, day: 5 }],
  '春分': [{ month: 3, day: 20 }],
  '清明': [{ month: 4, day: 4 }],
  '谷雨': [{ month: 4, day: 20 }],
  '立夏': [{ month: 5, day: 5 }],
  '小满': [{ month: 5, day: 21 }],
  '芒种': [{ month: 6, day: 6 }],
  '夏至': [{ month: 6, day: 21 }],
  '小暑': [{ month: 7, day: 7 }],
  '大暑': [{ month: 7, day: 22 }],
  '立秋': [{ month: 8, day: 7 }],
  '处暑': [{ month: 8, day: 23 }],
  '白露': [{ month: 9, day: 7 }],
  '秋分': [{ month: 9, day: 23 }],
  '寒露': [{ month: 10, day: 8 }],
  '霜降': [{ month: 10, day: 23 }],
  '立冬': [{ month: 11, day: 7 }],
  '小雪': [{ month: 11, day: 22 }],
  '大雪': [{ month: 12, day: 7 }],
  '冬至': [{ month: 12, day: 22 }],
};

// 简化的农历数据（2024-2025年部分数据）
// 实际项目中应使用更完整的农历算法库
const LUNAR_DATA: Record<string, { month: number; day: number; isLeap?: boolean }> = {
  '2025-12-04': { month: 11, day: 4 },
  '2025-12-05': { month: 11, day: 5 },
  '2025-12-06': { month: 11, day: 6 },
  '2025-12-07': { month: 11, day: 7 },
};

export interface LunarDate {
  year: number;
  month: number;
  day: number;
  monthStr: string;
  dayStr: string;
  yearGanZhi: string;
  zodiac: string;
  isLeapMonth: boolean;
}

export interface ChineseHour {
  name: string;
  range: string;
  organ: string;
}

export interface SolarTerm {
  name: string;
  tip: string;
  isToday: boolean;
  daysUntil: number;
}

export interface CalendarInfo {
  gregorian: {
    year: number;
    month: number;
    day: number;
    weekday: string;
    dateStr: string;
  };
  lunar: LunarDate;
  chineseHour: ChineseHour;
  currentTime: string;
  solarTerm: SolarTerm;
}

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

/**
 * 获取当前时辰
 */
export const getCurrentChineseHour = (date: Date = new Date()): ChineseHour => {
  const hour = date.getHours();

  // 子时跨越两天
  if (hour >= 23 || hour < 1) return CHINESE_HOURS[0];
  if (hour >= 1 && hour < 3) return CHINESE_HOURS[1];
  if (hour >= 3 && hour < 5) return CHINESE_HOURS[2];
  if (hour >= 5 && hour < 7) return CHINESE_HOURS[3];
  if (hour >= 7 && hour < 9) return CHINESE_HOURS[4];
  if (hour >= 9 && hour < 11) return CHINESE_HOURS[5];
  if (hour >= 11 && hour < 13) return CHINESE_HOURS[6];
  if (hour >= 13 && hour < 15) return CHINESE_HOURS[7];
  if (hour >= 15 && hour < 17) return CHINESE_HOURS[8];
  if (hour >= 17 && hour < 19) return CHINESE_HOURS[9];
  if (hour >= 19 && hour < 21) return CHINESE_HOURS[10];
  return CHINESE_HOURS[11];
};

/**
 * 获取农历日期（简化版）
 */
export const getLunarDate = (date: Date = new Date()): LunarDate => {
  const year = date.getFullYear();
  const dateStr = date.toISOString().split('T')[0];

  // 尝试从预设数据获取
  const lunarData = LUNAR_DATA[dateStr];

  // 简化计算：基于预设数据或使用近似值
  let lunarMonth = lunarData?.month || ((date.getMonth() + 2) % 12) || 12;
  let lunarDay = lunarData?.day || date.getDate();

  // 确保日期在有效范围内
  if (lunarDay > 30) lunarDay = 30;

  // 计算年份干支（简化：以立春为界）
  const stemIndex = (year - 4) % 10;
  const branchIndex = (year - 4) % 12;
  const yearGanZhi = HEAVENLY_STEMS[stemIndex] + EARTHLY_BRANCHES[branchIndex];
  const zodiac = ZODIAC_ANIMALS[branchIndex];

  return {
    year,
    month: lunarMonth,
    day: lunarDay,
    monthStr: LUNAR_MONTHS[lunarMonth - 1] + '月',
    dayStr: LUNAR_DAYS[lunarDay - 1],
    yearGanZhi,
    zodiac,
    isLeapMonth: lunarData?.isLeap || false,
  };
};

/**
 * 获取当前或最近的节气
 */
export const getCurrentSolarTerm = (date: Date = new Date()): SolarTerm => {
  const month = date.getMonth() + 1;
  const day = date.getDate();

  // 查找当前节气或最近的下一个节气
  let currentTerm: SolarTerm | null = null;
  let minDaysUntil = Infinity;

  for (const term of SOLAR_TERMS) {
    const termDates = SOLAR_TERM_DATES[term.name];
    if (!termDates) continue;

    for (const termDate of termDates) {
      // 计算到该节气的天数差
      const termMonth = termDate.month;
      const termDay = termDate.day;

      let daysUntil = 0;
      const isToday = month === termMonth && day === termDay;

      if (isToday) {
        return { ...term, isToday: true, daysUntil: 0 };
      }

      // 简化计算：同月比较
      if (month === termMonth) {
        daysUntil = termDay - day;
      } else if (month < termMonth) {
        // 节气在当前日期之后
        daysUntil = (termMonth - month) * 30 + (termDay - day);
      } else {
        // 节气在明年
        daysUntil = (12 - month + termMonth) * 30 + (termDay - day);
      }

      // 找最近的节气（可以是过去的或未来的）
      if (Math.abs(daysUntil) < Math.abs(minDaysUntil)) {
        minDaysUntil = daysUntil;
        currentTerm = { ...term, isToday: false, daysUntil };
      }
    }
  }

  // 如果没找到，返回默认值
  return currentTerm || {
    name: '大雪',
    tip: '养藏精气，温补为主',
    isToday: false,
    daysUntil: 0,
  };
};

/**
 * 获取完整的日历信息
 */
export const getCalendarInfo = (date: Date = new Date()): CalendarInfo => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekday = WEEKDAYS[date.getDay()];

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');

  return {
    gregorian: {
      year,
      month,
      day,
      weekday,
      dateStr: `${year}年${month}月${day}日`,
    },
    lunar: getLunarDate(date),
    chineseHour: getCurrentChineseHour(date),
    currentTime: `${hours}:${minutes}`,
    solarTerm: getCurrentSolarTerm(date),
  };
};

/**
 * 获取节气养生建议
 */
export const getSolarTermTip = (termName: string): string => {
  const term = SOLAR_TERMS.find(t => t.name === termName);
  return term?.tip || '顺应时节，养生保健';
};

export default {
  getCalendarInfo,
  getLunarDate,
  getCurrentChineseHour,
  getCurrentSolarTerm,
  getSolarTermTip,
};
