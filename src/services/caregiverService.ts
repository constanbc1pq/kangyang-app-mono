/**
 * 护理人员服务
 */

import { Caregiver, CaregiverReview } from '@/types/elderly';
import { getCaregiversByServiceType } from './elderlyService';

// 评价数据
const reviewsData: Record<string, CaregiverReview[]> = {
  '1': [
    {
      id: 'review1',
      userId: 'user1',
      userName: '张女士',
      userAvatar: '/user-zhang.jpg',
      caregiverId: '1',
      orderId: 'order001',
      serviceType: '养老护理',
      rating: 5,
      content: '王护士非常专业，对父亲的用药管理很细心，还教会了我们一些护理知识。父亲的血压控制得很好。',
      date: '2024-01-05',
      helpful: 18,
    },
    {
      id: 'review2',
      userId: 'user2',
      userName: '李先生',
      userAvatar: '/user-li.jpg',
      caregiverId: '1',
      orderId: 'order002',
      serviceType: '养老护理',
      rating: 5,
      content: '服务态度非常好，专业技能过硬，很放心把母亲交给王护士照顾。',
      date: '2024-01-10',
      helpful: 12,
    },
  ],
  '2': [
    {
      id: 'review3',
      userId: 'user3',
      userName: '王女士',
      userAvatar: '/user-wang.jpg',
      caregiverId: '2',
      orderId: 'order003',
      serviceType: '医疗护理',
      rating: 5,
      content: '李阿姨的伤口护理技术很专业，每次换药都很细致，伤口恢复得很快。',
      date: '2024-01-12',
      helpful: 15,
    },
  ],
  '3': [
    {
      id: 'review4',
      userId: 'user4',
      userName: '刘先生',
      userAvatar: '/user-liu.jpg',
      caregiverId: '3',
      orderId: 'order004',
      serviceType: '陪伴服务',
      rating: 5,
      content: '张师傅很有耐心，经常陪爸爸下棋聊天，爸爸现在每天都很开心。感谢张师傅的陪伴！',
      date: '2024-01-15',
      helpful: 20,
    },
  ],
  '4': [],
  '5': [],
  '6': [],
  '7': [],
};

/**
 * 根据ID获取护理人员详情
 */
export const getCaregiverById = async (caregiverId: string): Promise<Caregiver | null> => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 从所有服务类型中查找
      const allCaregivers = [
        ...getCaregiversByServiceType('elderly-care'),
        ...getCaregiversByServiceType('escort'),
        ...getCaregiversByServiceType('medical-staff'),
      ];

      const caregiver = allCaregivers.find((c) => c.id === caregiverId);
      resolve(caregiver || null);
    }, 300);
  });
};

/**
 * 获取护理人员评价列表
 */
export const getCaregiverReviews = async (caregiverId: string): Promise<CaregiverReview[]> => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(reviewsData[caregiverId] || []);
    }, 200);
  });
};

/**
 * 获取相似护理人员推荐
 */
export const getSimilarCaregivers = async (
  caregiverId: string,
  serviceType: string,
  limit: number = 3
): Promise<Caregiver[]> => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const caregivers = getCaregiversByServiceType(serviceType as any);
      const similar = caregivers
        .filter((c) => c.id !== caregiverId)
        .slice(0, limit);
      resolve(similar);
    }, 200);
  });
};

/**
 * 添加评价
 */
export const addCaregiverReview = async (review: Omit<CaregiverReview, 'id'>): Promise<boolean> => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      const newReview: CaregiverReview = {
        ...review,
        id: `review_${Date.now()}`,
      };

      if (!reviewsData[review.caregiverId]) {
        reviewsData[review.caregiverId] = [];
      }
      reviewsData[review.caregiverId].unshift(newReview);

      resolve(true);
    }, 300);
  });
};

/**
 * 评价点赞
 */
export const likeReview = async (reviewId: string): Promise<boolean> => {
  // 模拟异步请求
  return new Promise((resolve) => {
    setTimeout(() => {
      // 实际应该更新后端数据
      resolve(true);
    }, 200);
  });
};
