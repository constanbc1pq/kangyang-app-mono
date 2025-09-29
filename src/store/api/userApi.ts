import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { User, FamilyMember } from '@/types/common';
import { APP_CONFIG } from '@/constants/app';

export const userApi = createApi({
  reducerPath: 'userApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_CONFIG.api.baseUrl}/users`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['User', 'Family'],
  endpoints: (builder) => ({
    getProfile: builder.query<User, void>({
      query: () => 'profile',
      providesTags: ['User'],
    }),
    updateProfile: builder.mutation<User, Partial<User>>({
      query: (updates) => ({
        url: 'profile',
        method: 'PUT',
        body: updates,
      }),
      invalidatesTags: ['User'],
    }),
    getFamilyMembers: builder.query<FamilyMember[], void>({
      query: () => 'family-members',
      providesTags: ['Family'],
    }),
    addFamilyMember: builder.mutation<FamilyMember, { name: string; relationship: string; email: string }>({
      query: (data) => ({
        url: 'family-members',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Family'],
    }),
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useGetFamilyMembersQuery,
  useAddFamilyMemberMutation,
} = userApi;