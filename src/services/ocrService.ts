/**
 * OCR识别服务
 * 使用Google Cloud Vision API进行文字识别
 */

import * as ImageManipulator from 'expo-image-manipulator';
import {
  OCR_CONFIG,
  OCRFeatureType,
  VisionAPIRequest,
  VisionAPIResponse,
  isAPIKeyConfigured,
  getAPIURL,
} from '@/config/ocrConfig';

/**
 * OCR识别结果
 */
export interface OCRResult {
  success: boolean;
  text: string; // 识别到的文本
  confidence?: number; // 置信度（0-1）
  error?: string; // 错误信息
}

/**
 * OCR结果缓存
 */
const ocrCache = new Map<string, { result: OCRResult; timestamp: number }>();

/**
 * 图片URI转Base64
 * 支持fetch API (React Native和Web都支持)
 */
const imageURIToBase64 = async (uri: string): Promise<string> => {
  try {
    const response = await fetch(uri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64 = reader.result as string;
        // 移除 "data:image/jpeg;base64," 前缀
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('图片转Base64失败:', error);
    throw new Error('图片处理失败，请重试');
  }
};

/**
 * 压缩优化图片
 * 减少文件大小，提高识别速度
 */
export const optimizeImage = async (uri: string): Promise<string> => {
  try {
    const manipResult = await ImageManipulator.manipulateAsync(
      uri,
      [
        {
          resize: {
            width: OCR_CONFIG.IMAGE_MAX_WIDTH,
          },
        },
      ],
      {
        compress: OCR_CONFIG.IMAGE_QUALITY,
        format: ImageManipulator.SaveFormat.JPEG,
      }
    );

    return manipResult.uri;
  } catch (error) {
    console.error('图片优化失败:', error);
    // 优化失败时返回原图
    return uri;
  }
};

/**
 * 调用Google Vision API进行OCR识别
 */
const callGoogleVisionAPI = async (base64Image: string): Promise<VisionAPIResponse> => {
  if (!isAPIKeyConfigured()) {
    throw new Error('Google Vision API Key未配置，请先在ocrConfig.ts中配置API Key');
  }

  const requestBody: VisionAPIRequest = {
    requests: [
      {
        image: {
          content: base64Image,
        },
        features: [
          {
            type: OCRFeatureType.TEXT_DETECTION,
            maxResults: 10,
          },
        ],
        imageContext: {
          languageHints: ['zh', 'en'], // 支持中英文
        },
      },
    ],
  };

  try {
    const response = await fetch(getAPIURL(), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
      signal: AbortSignal.timeout(OCR_CONFIG.REQUEST_TIMEOUT),
    });

    if (!response.ok) {
      throw new Error(`API请求失败: ${response.status} ${response.statusText}`);
    }

    const data: VisionAPIResponse = await response.json();
    return data;
  } catch (error: any) {
    if (error.name === 'AbortError' || error.name === 'TimeoutError') {
      throw new Error('识别超时，请检查网络连接后重试');
    }
    throw error;
  }
};

/**
 * 解析Google Vision API响应
 */
const parseVisionAPIResponse = (response: VisionAPIResponse): OCRResult => {
  const firstResponse = response.responses[0];

  // 检查错误
  if (firstResponse.error) {
    return {
      success: false,
      text: '',
      error: `API错误: ${firstResponse.error.message}`,
    };
  }

  // 提取文本
  if (firstResponse.fullTextAnnotation) {
    return {
      success: true,
      text: firstResponse.fullTextAnnotation.text,
      confidence: 0.9, // Google Vision API通常有较高的准确率
    };
  }

  // 如果没有fullTextAnnotation，尝试从textAnnotations获取
  if (firstResponse.textAnnotations && firstResponse.textAnnotations.length > 0) {
    // textAnnotations[0]通常包含所有识别到的文本
    return {
      success: true,
      text: firstResponse.textAnnotations[0].description,
      confidence: 0.85,
    };
  }

  return {
    success: false,
    text: '',
    error: '未识别到文字内容',
  };
};

/**
 * 从缓存获取OCR结果
 */
const getCachedResult = (imageUri: string): OCRResult | null => {
  if (!OCR_CONFIG.ENABLE_CACHE) {
    return null;
  }

  const cached = ocrCache.get(imageUri);
  if (!cached) {
    return null;
  }

  // 检查缓存是否过期
  const now = Date.now();
  if (now - cached.timestamp > OCR_CONFIG.CACHE_EXPIRY_TIME) {
    ocrCache.delete(imageUri);
    return null;
  }

  console.log('使用缓存的OCR结果:', imageUri);
  return cached.result;
};

/**
 * 缓存OCR结果
 */
const cacheResult = (imageUri: string, result: OCRResult): void => {
  if (!OCR_CONFIG.ENABLE_CACHE) {
    return;
  }

  ocrCache.set(imageUri, {
    result,
    timestamp: Date.now(),
  });

  // 限制缓存大小，最多保留50个结果
  if (ocrCache.size > 50) {
    const firstKey = ocrCache.keys().next().value;
    ocrCache.delete(firstKey);
  }
};

/**
 * 主要OCR识别函数
 * @param imageUri 图片URI
 * @param skipCache 是否跳过缓存
 * @returns OCR识别结果
 */
export const recognizeImage = async (
  imageUri: string,
  skipCache: boolean = false
): Promise<OCRResult> => {
  try {
    // 检查缓存
    if (!skipCache) {
      const cachedResult = getCachedResult(imageUri);
      if (cachedResult) {
        return cachedResult;
      }
    }

    console.log('开始OCR识别:', imageUri);

    // 1. 优化图片
    const optimizedUri = await optimizeImage(imageUri);
    console.log('图片优化完成');

    // 2. 转换为Base64
    const base64Image = await imageURIToBase64(optimizedUri);
    console.log('图片转Base64完成');

    // 3. 调用Google Vision API
    const apiResponse = await callGoogleVisionAPI(base64Image);
    console.log('API调用完成');

    // 4. 解析响应
    const result = parseVisionAPIResponse(apiResponse);
    console.log('OCR识别结果:', result);

    // 5. 缓存结果（成功时）
    if (result.success) {
      cacheResult(imageUri, result);
    }

    return result;
  } catch (error: any) {
    console.error('OCR识别失败:', error);
    return {
      success: false,
      text: '',
      error: error.message || '识别失败，请重试',
    };
  }
};

/**
 * 带重试机制的OCR识别
 * @param imageUri 图片URI
 * @param maxRetries 最大重试次数
 * @returns OCR识别结果
 */
export const recognizeImageWithRetry = async (
  imageUri: string,
  maxRetries: number = OCR_CONFIG.MAX_RETRIES
): Promise<OCRResult> => {
  let lastError: string = '';

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    if (attempt > 0) {
      console.log(`OCR识别重试 ${attempt}/${maxRetries}`);
      // 等待一段时间后重试
      await new Promise((resolve) => setTimeout(resolve, 1000 * attempt));
    }

    const result = await recognizeImage(imageUri, attempt > 0); // 重试时跳过缓存

    if (result.success) {
      return result;
    }

    lastError = result.error || '未知错误';
  }

  return {
    success: false,
    text: '',
    error: `识别失败（已重试${maxRetries}次）: ${lastError}`,
  };
};

/**
 * 清除OCR缓存
 */
export const clearOCRCache = (): void => {
  ocrCache.clear();
  console.log('OCR缓存已清除');
};

/**
 * 获取缓存统计信息
 */
export const getCacheStats = () => {
  return {
    size: ocrCache.size,
    enabled: OCR_CONFIG.ENABLE_CACHE,
    expiryTime: OCR_CONFIG.CACHE_EXPIRY_TIME,
  };
};
