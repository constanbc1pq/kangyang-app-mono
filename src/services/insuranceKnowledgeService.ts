/**
 * 保险知识库服务
 * Insurance Knowledge Base Service
 *
 * 提供保险知识文章、视频、理赔案例、问答社区等知识库内容
 */

// 文章分类
export type ArticleCategory = 'all' | 'basics' | 'product_analysis' | 'claim_guide' | 'pitfall_prevention';

// 视频分类
export type VideoCategory = 'all' | 'basics' | 'product_review' | 'claim_practice';

// 案例分类
export type CaseCategory = 'all' | 'medical' | 'critical_illness' | 'accident' | 'life';

// 问答分类
export type QuestionCategory = 'all' | 'product' | 'claim' | 'underwriting';

// 文章数据结构
export interface Article {
  id: string;
  title: string;
  category: ArticleCategory;
  summary: string;
  content: string; // HTML格式
  author: string;
  authorTitle?: string;
  publishDate: string;
  readTime: number; // 阅读时间（分钟）
  views: number;
  likes: number;
  tags: string[];
  isHot: boolean;
  coverImage?: string;
}

// 视频数据结构
export interface Video {
  id: string;
  title: string;
  category: VideoCategory;
  description: string;
  instructor: string;
  duration: number; // 秒
  views: number;
  thumbnail: string;
  videoUrl: string;
  isCompleted?: boolean; // 用户是否已学习
  rating: number;
  tags: string[];
  publishDate: string;
}

// 理赔案例数据结构
export interface ClaimCase {
  id: string;
  title: string;
  category: CaseCategory;
  claimAmount: number; // 理赔金额（万元）
  claimDays: number; // 理赔天数
  isSuccessful: boolean;
  incident: string; // 出险经过
  claimProcess: string; // 理赔过程
  result: string;
  insight: string; // 理赔启示
  insuranceCompany: string;
  productName: string;
  publishDate: string;
}

// 问答数据结构
export interface Question {
  id: string;
  title: string;
  content: string;
  category: QuestionCategory;
  askerName: string;
  viewCount: number;
  likeCount: number;
  answerCount: number;
  isAnswered: boolean;
  isFeatured: boolean; // 精华问题
  tags: string[];
  createdAt: string;
  bestAnswer?: Answer;
}

// 回答数据结构
export interface Answer {
  id: string;
  questionId: string;
  advisorName: string;
  advisorTitle: string;
  content: string;
  likeCount: number;
  isBest: boolean;
  createdAt: string;
}

// Mock数据会在实际使用中从数据库加载
const mockArticles: Article[] = [];
const mockVideos: Video[] = [];
const mockClaimCases: ClaimCase[] = [];
const mockQuestions: Question[] = [];

/**
 * 获取文章列表
 */
export const getArticles = async (
  category: ArticleCategory = 'all',
  page: number = 1,
  limit: number = 10
): Promise<{ data: Article[]; total: number; page: number; limit: number }> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  // Mock数据会从数据库或CMS加载
  let articles = mockArticles;

  // 类别筛选
  if (category !== 'all') {
    articles = articles.filter(a => a.category === category);
  }

  // 按发布日期倒序
  articles.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedArticles = articles.slice(startIndex, endIndex);

  return {
    data: paginatedArticles,
    total: articles.length,
    page,
    limit,
  };
};

/**
 * 获取文章详情
 */
export const getArticleById = async (articleId: string): Promise<Article | null> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  const article = mockArticles.find(a => a.id === articleId);
  if (!article) {
    return null;
  }

  // 增加浏览量
  article.views++;

  return article;
};

/**
 * 搜索文章
 */
export const searchArticles = async (keyword: string): Promise<Article[]> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const lowerKeyword = keyword.toLowerCase();
  return mockArticles.filter(
    article =>
      article.title.toLowerCase().includes(lowerKeyword) ||
      article.summary.toLowerCase().includes(lowerKeyword) ||
      article.tags.some(tag => tag.includes(keyword))
  );
};

/**
 * 获取视频列表
 */
export const getVideos = async (category: VideoCategory = 'all'): Promise<Video[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let videos = mockVideos;

  // 类别筛选
  if (category !== 'all') {
    videos = videos.filter(v => v.category === category);
  }

  // 按发布日期倒序
  videos.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return videos;
};

/**
 * 获取理赔案例列表
 */
export const getClaimCases = async (category: CaseCategory = 'all'): Promise<ClaimCase[]> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let cases = mockClaimCases;

  // 类别筛选
  if (category !== 'all') {
    cases = cases.filter(c => c.category === category);
  }

  // 按发布日期倒序
  cases.sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime());

  return cases;
};

/**
 * 获取问答列表
 */
export const getQAList = async (
  category: QuestionCategory = 'all',
  sortBy: 'hot' | 'latest' | 'unanswered' = 'hot',
  page: number = 1,
  limit: number = 20
): Promise<{ data: Question[]; total: number; page: number; limit: number }> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  let questions = mockQuestions;

  // 类别筛选
  if (category !== 'all') {
    questions = questions.filter(q => q.category === category);
  }

  // 排序
  switch (sortBy) {
    case 'hot':
      // 热门：综合浏览量、点赞数、回答数
      questions.sort((a, b) => {
        const scoreA = a.viewCount * 0.3 + a.likeCount * 0.4 + a.answerCount * 0.3;
        const scoreB = b.viewCount * 0.3 + b.likeCount * 0.4 + b.answerCount * 0.3;
        return scoreB - scoreA;
      });
      break;
    case 'latest':
      // 最新
      questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
    case 'unanswered':
      // 未回答
      questions = questions.filter(q => !q.isAnswered);
      questions.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      break;
  }

  // 分页
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedQuestions = questions.slice(startIndex, endIndex);

  return {
    data: paginatedQuestions,
    total: questions.length,
    page,
    limit,
  };
};

/**
 * 提交问题
 */
export const submitQuestion = async (questionData: {
  title: string;
  content: string;
  category: QuestionCategory;
  tags: string[];
  askerName: string;
}): Promise<Question> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  const questionId = `q_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

  const newQuestion: Question = {
    id: questionId,
    title: questionData.title,
    content: questionData.content,
    category: questionData.category,
    askerName: questionData.askerName,
    viewCount: 0,
    likeCount: 0,
    answerCount: 0,
    isAnswered: false,
    isFeatured: false,
    tags: questionData.tags,
    createdAt: new Date().toISOString(),
  };

  mockQuestions.push(newQuestion);

  console.log(`✅ 问题已提交: ${questionData.title}`);

  return newQuestion;
};

/**
 * 获取热门标签
 */
export const getHotTags = async (type: 'article' | 'video' | 'question'): Promise<{
  tag: string;
  count: number;
}[]> => {
  await new Promise(resolve => setTimeout(resolve, 300));

  let allTags: string[] = [];

  switch (type) {
    case 'article':
      allTags = mockArticles.flatMap(a => a.tags);
      break;
    case 'video':
      allTags = mockVideos.flatMap(v => v.tags);
      break;
    case 'question':
      allTags = mockQuestions.flatMap(q => q.tags);
      break;
  }

  // 统计标签频率
  const tagCounts = allTags.reduce<Record<string, number>>((acc, tag) => {
    acc[tag] = (acc[tag] || 0) + 1;
    return acc;
  }, {});

  // 转换为数组并排序
  const hotTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 20); // 返回前20个

  return hotTags;
};

/**
 * 获取推荐内容
 */
export const getRecommendedContent = async (userId?: string): Promise<{
  articles: Article[];
  videos: Video[];
  questions: Question[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 500));

  // 简单的推荐逻辑（实际应该基于用户行为、兴趣标签等）
  const recommendedArticles = mockArticles
    .filter(a => a.isHot)
    .sort((a, b) => b.views - a.views)
    .slice(0, 5);

  const recommendedVideos = mockVideos
    .sort((a, b) => b.rating * b.views - a.rating * a.views)
    .slice(0, 5);

  const recommendedQuestions = mockQuestions
    .filter(q => q.isFeatured)
    .sort((a, b) => b.viewCount - a.viewCount)
    .slice(0, 5);

  return {
    articles: recommendedArticles,
    videos: recommendedVideos,
    questions: recommendedQuestions,
  };
};

/**
 * 记录用户学习行为
 */
export const trackLearningBehavior = async (
  userId: string,
  contentType: 'article' | 'video' | 'case' | 'question',
  contentId: string,
  action: 'view' | 'like' | 'bookmark' | 'complete'
): Promise<void> => {
  await new Promise(resolve => setTimeout(resolve, 200));

  console.log(
    `✅ 用户行为记录: 用户 ${userId} ${action} ${contentType} ${contentId}`
  );

  // 实际应该记录到数据库，用于个性化推荐
  switch (action) {
    case 'view':
      // 增加浏览量
      if (contentType === 'article') {
        const article = mockArticles.find(a => a.id === contentId);
        if (article) article.views++;
      } else if (contentType === 'video') {
        const video = mockVideos.find(v => v.id === contentId);
        if (video) video.views++;
      } else if (contentType === 'question') {
        const question = mockQuestions.find(q => q.id === contentId);
        if (question) question.viewCount++;
      }
      break;
    case 'like':
      // 增加点赞数
      if (contentType === 'article') {
        const article = mockArticles.find(a => a.id === contentId);
        if (article) article.likes++;
      } else if (contentType === 'question') {
        const question = mockQuestions.find(q => q.id === contentId);
        if (question) question.likeCount++;
      }
      break;
    case 'complete':
      // 标记为已完成
      if (contentType === 'video') {
        const video = mockVideos.find(v => v.id === contentId);
        if (video) video.isCompleted = true;
      }
      break;
  }
};

/**
 * 获取用户学习统计
 */
export const getUserLearningStats = async (userId: string): Promise<{
  totalArticlesRead: number;
  totalVideosWatched: number;
  totalLearningTime: number; // 分钟
  streakDays: number; // 连续学习天数
  achievements: {
    name: string;
    description: string;
    earnedAt: string;
  }[];
}> => {
  await new Promise(resolve => setTimeout(resolve, 400));

  // Mock数据，实际应该从数据库统计
  return {
    totalArticlesRead: 45,
    totalVideosWatched: 12,
    totalLearningTime: 680, // 约11小时
    streakDays: 7,
    achievements: [
      {
        name: '入门学徒',
        description: '完成10篇文章阅读',
        earnedAt: '2024-10-15T10:30:00Z',
      },
      {
        name: '知识探索者',
        description: '完成5个视频课程学习',
        earnedAt: '2024-10-28T16:20:00Z',
      },
      {
        name: '七日坚持',
        description: '连续学习7天',
        earnedAt: '2024-11-12T09:00:00Z',
      },
    ],
  };
};
