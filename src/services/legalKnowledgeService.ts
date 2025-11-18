/**
 * 法律知识库服务
 * 提供法律文章、视频、案例等知识内容的查询和管理
 */

import {
  LegalArticle,
  LegalVideo,
  CaseStudy,
} from '../types/legalService';
import {
  getLegalArticles,
  getLegalArticlesByCategory,
  getLegalVideos,
  getCaseStudies,
} from './legalService';

/**
 * 分页参数接口
 */
export interface PaginationParams {
  page: number;
  pageSize: number;
}

/**
 * 分页结果接口
 */
export interface PaginatedResult<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

/**
 * 获取法律文章列表（支持分类和分页）
 */
export const getArticles = async (
  category?: string,
  pagination?: PaginationParams
): Promise<PaginatedResult<LegalArticle>> => {
  try {
    // 获取文章数据
    let articles = category
      ? await getLegalArticlesByCategory(category)
      : await getLegalArticles();

    // 按发布日期倒序排序
    articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

    // 应用分页
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = articles.slice(startIndex, endIndex);

    return {
      data: paginatedArticles,
      total: articles.length,
      page,
      pageSize,
      totalPages: Math.ceil(articles.length / pageSize),
    };
  } catch (error) {
    console.error('Error getting articles:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    };
  }
};

/**
 * 根据ID获取文章详情
 */
export const getArticleById = async (articleId: string): Promise<LegalArticle | null> => {
  try {
    const articles = await getLegalArticles();
    const article = articles.find(a => a.id === articleId);

    if (article) {
      // 增加浏览量（这里只是模拟，实际应该更新存储）
      article.views = (article.views || 0) + 1;
    }

    return article || null;
  } catch (error) {
    console.error('Error getting article by id:', error);
    return null;
  }
};

/**
 * 搜索法律文章
 */
export const searchArticles = async (
  keyword: string,
  pagination?: PaginationParams
): Promise<PaginatedResult<LegalArticle>> => {
  try {
    const allArticles = await getLegalArticles();
    const lowerKeyword = keyword.toLowerCase();

    // 搜索标题、摘要、标签
    const matchedArticles = allArticles.filter(
      article =>
        article.title.toLowerCase().includes(lowerKeyword) ||
        article.summary?.toLowerCase().includes(lowerKeyword) ||
        article.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword)) ||
        article.content?.toLowerCase().includes(lowerKeyword)
    );

    // 按相关度排序（简化版，实际应该有更复杂的相关度算法）
    matchedArticles.sort((a, b) => {
      const aScore = (a.title.toLowerCase().includes(lowerKeyword) ? 10 : 0) + (a.views || 0) / 1000;
      const bScore = (b.title.toLowerCase().includes(lowerKeyword) ? 10 : 0) + (b.views || 0) / 1000;
      return bScore - aScore;
    });

    // 应用分页
    const page = pagination?.page || 1;
    const pageSize = pagination?.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedArticles = matchedArticles.slice(startIndex, endIndex);

    return {
      data: paginatedArticles,
      total: matchedArticles.length,
      page,
      pageSize,
      totalPages: Math.ceil(matchedArticles.length / pageSize),
    };
  } catch (error) {
    console.error('Error searching articles:', error);
    return {
      data: [],
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    };
  }
};

/**
 * 获取法律视频列表（支持分类）
 */
export const getVideos = async (category?: string): Promise<LegalVideo[]> => {
  try {
    const videos = await getLegalVideos();

    if (!category) {
      return videos;
    }

    // 按分类筛选
    return videos.filter(video => video.category === category);
  } catch (error) {
    console.error('Error getting videos:', error);
    return [];
  }
};

/**
 * 根据ID获取视频详情
 */
export const getVideoById = async (videoId: string): Promise<LegalVideo | null> => {
  try {
    const videos = await getLegalVideos();
    const video = videos.find(v => v.id === videoId);

    if (video) {
      // 增加浏览量
      video.views = (video.views || 0) + 1;
    }

    return video || null;
  } catch (error) {
    console.error('Error getting video by id:', error);
    return null;
  }
};

/**
 * 搜索法律视频
 */
export const searchVideos = async (keyword: string): Promise<LegalVideo[]> => {
  try {
    const videos = await getLegalVideos();
    const lowerKeyword = keyword.toLowerCase();

    return videos.filter(
      video =>
        video.title.toLowerCase().includes(lowerKeyword) ||
        video.description?.toLowerCase().includes(lowerKeyword) ||
        video.instructor?.toLowerCase().includes(lowerKeyword)
    );
  } catch (error) {
    console.error('Error searching videos:', error);
    return [];
  }
};

/**
 * 获取案例列表（支持分类）
 */
export const getCases = async (category?: string): Promise<CaseStudy[]> => {
  try {
    const cases = await getCaseStudies();

    if (!category) {
      return cases;
    }

    // 按分类筛选
    return cases.filter(c => c.category === category || c.caseType === category);
  } catch (error) {
    console.error('Error getting case studies:', error);
    return [];
  }
};

/**
 * 根据ID获取案例详情
 */
export const getCaseById = async (caseId: string): Promise<CaseStudy | null> => {
  try {
    const cases = await getCaseStudies();
    return cases.find(c => c.id === caseId) || null;
  } catch (error) {
    console.error('Error getting case by id:', error);
    return null;
  }
};

/**
 * 搜索案例
 */
export const searchCases = async (keyword: string): Promise<CaseStudy[]> => {
  try {
    const cases = await getCaseStudies();
    const lowerKeyword = keyword.toLowerCase();

    return cases.filter(
      c =>
        c.title.toLowerCase().includes(lowerKeyword) ||
        c.summary?.toLowerCase().includes(lowerKeyword) ||
        c.caseFacts?.toLowerCase().includes(lowerKeyword) ||
        c.tags?.some(tag => tag.toLowerCase().includes(lowerKeyword))
    );
  } catch (error) {
    console.error('Error searching cases:', error);
    return [];
  }
};

/**
 * 获取热门文章
 */
export const getPopularArticles = async (limit: number = 10): Promise<LegalArticle[]> => {
  try {
    const articles = await getLegalArticles();

    // 按浏览量和点赞数排序
    articles.sort((a, b) => {
      const scoreA = (a.views || 0) * 0.7 + (a.likes || 0) * 0.3;
      const scoreB = (b.views || 0) * 0.7 + (b.likes || 0) * 0.3;
      return scoreB - scoreA;
    });

    return articles.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular articles:', error);
    return [];
  }
};

/**
 * 获取热门视频
 */
export const getPopularVideos = async (limit: number = 10): Promise<LegalVideo[]> => {
  try {
    const videos = await getLegalVideos();

    // 按浏览量和点赞数排序
    videos.sort((a, b) => {
      const scoreA = (a.views || 0) * 0.7 + (a.likes || 0) * 0.3;
      const scoreB = (b.views || 0) * 0.7 + (b.likes || 0) * 0.3;
      return scoreB - scoreA;
    });

    return videos.slice(0, limit);
  } catch (error) {
    console.error('Error getting popular videos:', error);
    return [];
  }
};

/**
 * 获取文章分类列表
 */
export const getArticleCategories = async (): Promise<string[]> => {
  try {
    const articles = await getLegalArticles();
    const categories = new Set<string>();

    articles.forEach(article => {
      if (article.category) {
        categories.add(article.category);
      }
    });

    return Array.from(categories);
  } catch (error) {
    console.error('Error getting article categories:', error);
    return [];
  }
};

/**
 * 获取视频分类列表
 */
export const getVideoCategories = async (): Promise<string[]> => {
  try {
    const videos = await getLegalVideos();
    const categories = new Set<string>();

    videos.forEach(video => {
      if (video.category) {
        categories.add(video.category);
      }
    });

    return Array.from(categories);
  } catch (error) {
    console.error('Error getting video categories:', error);
    return [];
  }
};

/**
 * 点赞文章
 */
export const likeArticle = async (articleId: string): Promise<boolean> => {
  try {
    // 这里应该更新文章的点赞数
    // 由于 legalService 中的数据是 mock 数据，这里只是模拟
    console.log(`文章 ${articleId} 点赞成功`);
    return true;
  } catch (error) {
    console.error('Error liking article:', error);
    return false;
  }
};

/**
 * 点赞视频
 */
export const likeVideo = async (videoId: string): Promise<boolean> => {
  try {
    console.log(`视频 ${videoId} 点赞成功`);
    return true;
  } catch (error) {
    console.error('Error liking video:', error);
    return false;
  }
};

/**
 * 收藏文章
 */
export const bookmarkArticle = async (userId: string, articleId: string): Promise<boolean> => {
  try {
    // 这里应该保存用户的收藏记录
    console.log(`用户 ${userId} 收藏文章 ${articleId}`);
    return true;
  } catch (error) {
    console.error('Error bookmarking article:', error);
    return false;
  }
};

/**
 * 收藏视频
 */
export const bookmarkVideo = async (userId: string, videoId: string): Promise<boolean> => {
  try {
    console.log(`用户 ${userId} 收藏视频 ${videoId}`);
    return true;
  } catch (error) {
    console.error('Error bookmarking video:', error);
    return false;
  }
};

export default {
  getArticles,
  getArticleById,
  searchArticles,
  getVideos,
  getVideoById,
  searchVideos,
  getCases,
  getCaseById,
  searchCases,
  getPopularArticles,
  getPopularVideos,
  getArticleCategories,
  getVideoCategories,
  likeArticle,
  likeVideo,
  bookmarkArticle,
  bookmarkVideo,
};
