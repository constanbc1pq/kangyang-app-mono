/**
 * 头像图片资源
 *
 * 医生和律师的本地头像图片映射
 * 使用 'local:xxx' 格式的字符串标识本地图片
 *
 * 命名规则：a开头=女性，b开头=男性
 */

import { ImageSourcePropType } from 'react-native';

// 医生头像图片 (15位医生: 10女 + 5男)
export const DOCTOR_AVATARS: Record<string, ImageSourcePropType> = {
  // 男性医生 (5位)
  doctor_001: require('../../assets/images/doctors/bp1fw1bp1fw1bp1f.png'),       // 王明远教授
  doctor_003: require('../../assets/images/doctors/b13pale13pale13pa.png'),      // 张伟教授
  doctor_007: require('../../assets/images/doctors/bdupifgdupifgdupi.png'),      // 孙志强教授
  doctor_009: require('../../assets/images/doctors/be6db409e-6563-40fe-8d27-ab584c7ddf2c.jpg'), // 吴磊医生
  doctor_014: require('../../assets/images/doctors/bgqjmmggqjmmggqjm.png'),      // 钱伟医生

  // 女性医生 (10位)
  doctor_002: require('../../assets/images/doctors/a3bdba97f-38d0-48bb-82f5-6a2a3c072aa3.jpg'), // 李慧教授
  doctor_004: require('../../assets/images/doctors/a43d715d4-9772-4c20-bd24-b97da8462e4d.jpg'), // 陈静怡副教授
  doctor_005: require('../../assets/images/doctors/a5e4f25cf-ccf0-4535-8826-05fecbced73f.jpg'), // 刘芳华医生
  doctor_006: require('../../assets/images/doctors/a8ece7adc-8158-4307-9524-24d62b20fcb2.jpg'), // 赵敏教授
  doctor_008: require('../../assets/images/doctors/a_vkncevvkncevvknc.png'),     // 周莉副教授
  doctor_010: require('../../assets/images/doctors/ab7908add-7b21-4cc2-b535-e3ad2c9b9909.jpg'), // 马小康教授
  doctor_011: require('../../assets/images/doctors/ace3b2d77-32bb-48e3-8de5-c7f07a4f9795.jpg'), // 郑雪医生
  doctor_012: require('../../assets/images/doctors/ae_iwigkiiwigkiiwig.png'),    // 林燕教授
  doctor_013: require('../../assets/images/doctors/af3387b13-ac2e-4a7e-937a-6b5648a8fc31.jpg'), // 黄丽副教授
  doctor_015: require('../../assets/images/doctors/aofz2nlofz2nlofz2.png'),      // 宋梅教授
};

// 律师头像图片 (10位律师: 5女 + 5男)
export const LAWYER_AVATARS: Record<string, ImageSourcePropType> = {
  // 男性律师 (5位)
  lawyer_001: require('../../assets/images/lawyers/b1768507-91f1-4198-8b5e-90cf6f7a5c81.jpg'),  // 陈华
  lawyer_003: require('../../assets/images/lawyers/b20d2b8bd-069e-445b-b78b-ccbaafc28e27.jpg'), // 张强
  lawyer_005: require('../../assets/images/lawyers/b2a153cee-42b1-4191-a220-8a6142ac0c45.jpg'), // 李国栋
  lawyer_007: require('../../assets/images/lawyers/b301cdbb7-6685-4827-9617-68e0ac854447.jpg'), // 黄志远
  lawyer_009: require('../../assets/images/lawyers/b3c083ca0-73fd-4c62-a1db-ab82ea1728ec.jpg'), // 吴明辉

  // 女性律师 (5位)
  lawyer_002: require('../../assets/images/lawyers/a10b4c734-1d77-44a9-9115-9c89d65499bf.jpg'), // 王丽
  lawyer_004: require('../../assets/images/lawyers/a184c8f8a-e395-47ec-9aa3-3da6b4f986a7.jpg'), // 刘慧敏
  lawyer_006: require('../../assets/images/lawyers/a1c6c2321-5e0d-4fbc-8207-7280e4475270.jpg'), // 周晓燕
  lawyer_008: require('../../assets/images/lawyers/a3a142842-ef43-454b-b4d8-0f41292d6170.jpg'), // 郑美玲
  lawyer_010: require('../../assets/images/lawyers/af3387b13-ac2e-4a7e-937a-6b5648a8fc31.jpg'), // 林秀珍
};

/**
 * 解析头像字符串，返回图片源
 * 支持格式:
 * - 'local:doctor_001' -> 本地医生图片
 * - 'local:lawyer_001' -> 本地律师图片
 * - 'https://...' -> 网络图片 URI
 *
 * @param avatar 头像字符串
 * @param fallbackName 如果没有头像，用于生成默认头像的名字
 * @returns 图片源 (ImageSourcePropType 或 { uri: string })
 */
export const getAvatarSource = (
  avatar: string | undefined,
  fallbackName?: string
): ImageSourcePropType | { uri: string } => {
  if (!avatar) {
    // 生成默认头像 URL
    const name = fallbackName || '用户';
    return { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200` };
  }

  // 提取 ID（支持 'local:doctor_001' 和 'doctor_001' 两种格式）
  let id = avatar;
  if (avatar.startsWith('local:')) {
    id = avatar.substring(6); // 去掉 'local:' 前缀
  }

  // 检查是否是医生头像
  if (id.startsWith('doctor_') && DOCTOR_AVATARS[id]) {
    return DOCTOR_AVATARS[id];
  }

  // 检查是否是律师头像
  if (id.startsWith('lawyer_') && LAWYER_AVATARS[id]) {
    return LAWYER_AVATARS[id];
  }

  // 如果是以 'local:' 开头但没找到对应图片，返回默认头像
  if (avatar.startsWith('local:')) {
    const name = fallbackName || '用户';
    return { uri: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&color=fff&size=200` };
  }

  // 网络图片 URL
  return { uri: avatar };
};

/**
 * 检查头像源是否为本地资源
 */
export const isLocalAvatar = (avatar: string | undefined): boolean => {
  return avatar?.startsWith('local:') || false;
};

// 根据医生ID获取头像（保留旧 API 兼容性）
export const getDoctorAvatar = (doctorId: string): ImageSourcePropType | null => {
  return DOCTOR_AVATARS[doctorId] || null;
};

// 根据律师ID获取头像（保留旧 API 兼容性）
export const getLawyerAvatar = (lawyerId: string): ImageSourcePropType | null => {
  return LAWYER_AVATARS[lawyerId] || null;
};
