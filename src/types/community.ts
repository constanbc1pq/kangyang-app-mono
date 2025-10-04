// 社区相关类型定义

// 作者信息
export interface Author {
  id: string;
  name: string;
  avatar?: string;
  title: string;
  verified: boolean;
  followers?: number;
  articles?: number;
}

// 文章
export interface Article {
  id: string;
  title: string;
  summary: string;
  content: string;
  author: Author;
  publishTime: string;
  readTime: string;
  views: number;
  likes: number;
  shares: number;
  comments: number;
  category: string;
  tags: string[];
  image?: string;
  isBookmarked?: boolean;
  isLiked?: boolean;
}

// 圈子成员
export interface CircleMember {
  id: string;
  name: string;
  avatar?: string;
  level: string;
  posts: number;
  joinDate: string;
}

// 圈子管理员
export interface CircleAdmin {
  name: string;
  avatar?: string;
  title: string;
  role: string;
}

// 圈子帖子
export interface CirclePost {
  id: string;
  user: {
    name: string;
    avatar?: string;
    level: string;
    verified: boolean;
  };
  content: string;
  images?: string[];
  timestamp: string;
  likes: number;
  comments: number;
  isPinned?: boolean;
}

// 圈子
export interface Circle {
  id: string;
  name: string;
  description: string;
  members: number;
  posts: number;
  todayPosts: number;
  image?: string;
  coverImage?: string;
  tags: string[];
  isVerified: boolean;
  createdDate: string;
  rules: string[];
  admins: CircleAdmin[];
  isJoined: boolean;
  category: string;
}

// 话题
export interface Topic {
  id: string;
  name: string;
  description: string;
  posts: number;
  participants: number;
  views: number;
  trend: 'up' | 'down' | 'stable';
  trendValue: string;
  tags: string[];
  image?: string;
  createdDate: string;
  isFollowing: boolean;
}

// 评论
export interface Comment {
  id: string;
  user: {
    name: string;
    avatar?: string;
    verified: boolean;
  };
  content: string;
  timestamp: string;
  likes: number;
  replies?: Comment[];
}

// 视频
export interface Video {
  id: string;
  title: string;
  description: string;
  author: Author;
  publishTime: string;
  duration: string;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  category: string;
  tags: string[];
  thumbnail: string;
  videoUrl: string;
  isLiked?: boolean;
  isFollowed?: boolean;
}

// 用户社区数据（本地存储）
export interface UserCommunityData {
  bookmarkedArticles: string[]; // 收藏的文章ID列表
  likedArticles: string[]; // 点赞的文章ID列表
  joinedCircles: string[]; // 加入的圈子ID列表
  followedTopics: string[]; // 关注的话题ID列表
  circlePostLikes: string[]; // 点赞的圈子帖子ID列表
  commentLikes: string[]; // 点赞的评论ID列表
  likedVideos: string[]; // 点赞的视频ID列表
  followedAuthors: string[]; // 关注的作者ID列表
}
