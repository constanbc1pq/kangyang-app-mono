import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { APP_CONFIG } from '@/constants/app';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export const authApi = createApi({
  reducerPath: 'authApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_CONFIG.api.baseUrl}/auth`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Auth'],
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: 'login',
        method: 'POST',
        body: credentials,
      }),
      invalidatesTags: ['Auth'],
    }),
    register: builder.mutation<LoginResponse, RegisterRequest>({
      query: (userData) => ({
        url: 'register',
        method: 'POST',
        body: userData,
      }),
      invalidatesTags: ['Auth'],
    }),
    refreshToken: builder.mutation<{ token: string; refreshToken: string }, { refreshToken: string }>({
      query: ({ refreshToken }) => ({
        url: 'refresh',
        method: 'POST',
        body: { refreshToken },
      }),
    }),
    logout: builder.mutation<void, void>({
      query: () => ({
        url: 'logout',
        method: 'POST',
      }),
      invalidatesTags: ['Auth'],
    }),
    forgotPassword: builder.mutation<{ message: string }, { email: string }>({
      query: ({ email }) => ({
        url: 'forgot-password',
        method: 'POST',
        body: { email },
      }),
    }),
    resetPassword: builder.mutation<{ message: string }, { token: string; password: string }>({
      query: ({ token, password }) => ({
        url: 'reset-password',
        method: 'POST',
        body: { token, password },
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useRefreshTokenMutation,
  useLogoutMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;