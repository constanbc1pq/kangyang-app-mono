import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../index';
import { Device } from '@/types/common';
import { APP_CONFIG } from '@/constants/app';

export const deviceApi = createApi({
  reducerPath: 'deviceApi',
  baseQuery: fetchBaseQuery({
    baseUrl: `${APP_CONFIG.api.baseUrl}/devices`,
    prepareHeaders: (headers, { getState }) => {
      const token = (getState() as RootState).auth.token;
      if (token) {
        headers.set('authorization', `Bearer ${token}`);
      }
      headers.set('content-type', 'application/json');
      return headers;
    },
  }),
  tagTypes: ['Device'],
  endpoints: (builder) => ({
    getDevices: builder.query<Device[], void>({
      query: () => '',
      providesTags: ['Device'],
    }),
    bindDevice: builder.mutation<Device, { name: string; type: string; macAddress: string }>({
      query: (data) => ({
        url: 'bind',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Device'],
    }),
    unbindDevice: builder.mutation<void, string>({
      query: (id) => ({
        url: `unbind/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Device'],
    }),
    syncDevice: builder.mutation<void, string>({
      query: (id) => ({
        url: `sync/${id}`,
        method: 'POST',
      }),
      invalidatesTags: ['Device'],
    }),
  }),
});

export const {
  useGetDevicesQuery,
  useBindDeviceMutation,
  useUnbindDeviceMutation,
  useSyncDeviceMutation,
} = deviceApi;