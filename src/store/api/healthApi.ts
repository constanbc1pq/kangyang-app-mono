import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { HealthData, AIReport, PaginatedResponse } from '@/types/common';
import { APP_CONFIG } from '@/constants/app';

export interface CreateHealthDataRequest {
  type: string;
  value: number;
  unit: string;
  timestamp: string;
  deviceId?: string;
  metadata?: Record<string, any>;
}

export interface GetHealthDataParams {
  type?: string;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

export interface GenerateReportRequest {
  type: 'daily' | 'weekly' | 'monthly';
  startDate: string;
  endDate: string;
}

export const healthApi = createApi({
  reducerPath: 'healthApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_CONFIG.api.baseUrl}/health`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['HealthData', 'AIReport'],
  endpoints: (builder) => ({
    getHealthData: builder.query<PaginatedResponse<HealthData>, GetHealthDataParams>({
      query: (params) => ({
        url: 'data',
        params,
      }),
      providesTags: ['HealthData'],
    }),
    createHealthData: builder.mutation<HealthData, CreateHealthDataRequest>({
      query: (data) => ({
        url: 'data',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['HealthData'],
    }),
    updateHealthData: builder.mutation<HealthData, { id: string; updates: Partial<HealthData> }>({
      query: ({ id, updates }) => ({
        url: `data/${id}`,
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['HealthData'],
    }),
    deleteHealthData: builder.mutation<void, string>({
      query: (id) => ({
        url: `data/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['HealthData'],
    }),
    getHealthTrends: builder.query<any, { type: string; period: string }>({
      query: ({ type, period }) => ({
        url: 'trends',
        params: { type, period },
      }),
      providesTags: ['HealthData'],
    }),
    generateAIReport: builder.mutation<AIReport, GenerateReportRequest>({
      query: (data) => ({
        url: 'ai/generate-report',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['AIReport'],
    }),
    getAIReports: builder.query<PaginatedResponse<AIReport>, { page?: number; limit?: number }>({
      query: (params) => ({
        url: 'ai/reports',
        params,
      }),
      providesTags: ['AIReport'],
    }),
    getAIRecommendations: builder.query<any, void>({
      query: () => 'ai/recommendations',
      providesTags: ['AIReport'],
    }),
  }),
});

export const {
  useGetHealthDataQuery,
  useCreateHealthDataMutation,
  useUpdateHealthDataMutation,
  useDeleteHealthDataMutation,
  useGetHealthTrendsQuery,
  useGenerateAIReportMutation,
  useGetAIReportsQuery,
  useGetAIRecommendationsQuery,
} = healthApi;