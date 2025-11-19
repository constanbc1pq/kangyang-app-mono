/**
 * OCR识别配置
 * 支持 Tesseract.js（免费离线）和 Google Cloud Vision API
 */

/**
 * OCR 提供者类型
 */
export enum OCRProvider {
  ML_KIT = 'ml_kit', // Google ML Kit（免费离线，推荐移动端使用）
  TESSERACT = 'tesseract', // 免费离线 OCR（仅 Web 端）
  GOOGLE_VISION = 'google_vision', // Google Cloud Vision API（付费）
  BAIDU = 'baidu', // 百度 OCR（有免费额度）
}

// ⚠️ 测试阶段配置 - 生产环境需要移到后端
export const OCR_CONFIG = {
  // 当前使用的 OCR 提供者（移动端推荐使用 ML_KIT）
  PROVIDER: OCRProvider.ML_KIT,

  // Google Vision API Key（切换到 GOOGLE_VISION 时需要配置）
  // 获取方式：https://console.cloud.google.com/ → 创建项目 → 启用Cloud Vision API → 创建API密钥
  GOOGLE_VISION_API_KEY: 'YOUR_GOOGLE_VISION_API_KEY_HERE',

  // API端点
  GOOGLE_VISION_API_ENDPOINT: 'https://vision.googleapis.com/v1/images:annotate',

  // Tesseract.js 配置
  TESSERACT_LANG: 'chi_sim+eng', // 简体中文 + 英文
  TESSERACT_WORKER_PATH: undefined, // 使用默认 CDN

  // 请求配置
  REQUEST_TIMEOUT: 30000, // 30秒超时
  MAX_RETRIES: 2, // 最大重试次数

  // 图片优化配置
  IMAGE_MAX_WIDTH: 1024, // 压缩后的最大宽度（像素）
  IMAGE_QUALITY: 0.8, // 图片质量（0-1）
  IMAGE_FORMAT: 'jpeg' as const, // 图片格式

  // 缓存配置
  ENABLE_CACHE: true, // 是否启用OCR结果缓存
  CACHE_EXPIRY_TIME: 3600000, // 缓存过期时间（1小时）
};

/**
 * OCR识别类型
 */
export enum OCRFeatureType {
  TEXT_DETECTION = 'TEXT_DETECTION', // 文本检测
  DOCUMENT_TEXT_DETECTION = 'DOCUMENT_TEXT_DETECTION', // 文档文本检测（更适合密集文字）
}

/**
 * Google Vision API请求配置
 */
export interface VisionAPIRequest {
  requests: Array<{
    image: {
      content: string; // Base64编码的图片
    };
    features: Array<{
      type: OCRFeatureType;
      maxResults?: number;
    }>;
    imageContext?: {
      languageHints?: string[]; // 语言提示，如 ['zh', 'en']
    };
  }>;
}

/**
 * Google Vision API响应类型
 */
export interface VisionAPIResponse {
  responses: Array<{
    fullTextAnnotation?: {
      text: string;
      pages?: any[];
    };
    textAnnotations?: Array<{
      description: string;
      locale?: string;
      boundingPoly?: any;
    }>;
    error?: {
      code: number;
      message: string;
      status: string;
    };
  }>;
}

/**
 * 检查API Key是否已配置
 */
export const isAPIKeyConfigured = (): boolean => {
  return (
    OCR_CONFIG.GOOGLE_VISION_API_KEY !== '' &&
    OCR_CONFIG.GOOGLE_VISION_API_KEY !== 'YOUR_GOOGLE_VISION_API_KEY_HERE'
  );
};

/**
 * 获取API请求URL
 */
export const getAPIURL = (): string => {
  return `${OCR_CONFIG.GOOGLE_VISION_API_ENDPOINT}?key=${OCR_CONFIG.GOOGLE_VISION_API_KEY}`;
};
