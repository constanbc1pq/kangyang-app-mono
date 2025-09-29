import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { HealthState, HealthData, AIReport, SyncStatus } from '@/types/common';
import { RootState } from '../index';

const initialState: HealthState = {
  data: [],
  reports: [],
  isLoading: false,
  error: null,
  syncStatus: 'idle',
};

const healthSlice = createSlice({
  name: 'health',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setHealthData: (state, action: PayloadAction<HealthData[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    addHealthData: (state, action: PayloadAction<HealthData>) => {
      state.data.unshift(action.payload); // Add to beginning for chronological order
    },
    updateHealthData: (state, action: PayloadAction<{ id: string; updates: Partial<HealthData> }>) => {
      const index = state.data.findIndex(item => item.id === action.payload.id);
      if (index !== -1) {
        state.data[index] = { ...state.data[index], ...action.payload.updates };
      }
    },
    removeHealthData: (state, action: PayloadAction<string>) => {
      state.data = state.data.filter(item => item.id !== action.payload);
    },
    setReports: (state, action: PayloadAction<AIReport[]>) => {
      state.reports = action.payload;
    },
    addReport: (state, action: PayloadAction<AIReport>) => {
      state.reports.unshift(action.payload);
    },
    updateReport: (state, action: PayloadAction<{ id: string; updates: Partial<AIReport> }>) => {
      const index = state.reports.findIndex(report => report.id === action.payload.id);
      if (index !== -1) {
        state.reports[index] = { ...state.reports[index], ...action.payload.updates };
      }
    },
    setSyncStatus: (state, action: PayloadAction<SyncStatus>) => {
      state.syncStatus = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.syncStatus = 'error';
    },
    clearError: (state) => {
      state.error = null;
    },
    clearHealthData: (state) => {
      state.data = [];
      state.reports = [];
      state.error = null;
      state.isLoading = false;
      state.syncStatus = 'idle';
    },
  },
});

export const {
  setLoading,
  setHealthData,
  addHealthData,
  updateHealthData,
  removeHealthData,
  setReports,
  addReport,
  updateReport,
  setSyncStatus,
  setError,
  clearError,
  clearHealthData,
} = healthSlice.actions;

// Selectors
export const selectHealth = (state: RootState) => state.health;
export const selectHealthData = (state: RootState) => state.health.data;
export const selectHealthReports = (state: RootState) => state.health.reports;
export const selectHealthLoading = (state: RootState) => state.health.isLoading;
export const selectHealthError = (state: RootState) => state.health.error;
export const selectSyncStatus = (state: RootState) => state.health.syncStatus;

// Advanced selectors
export const selectHealthDataByType = (type: string) => (state: RootState) =>
  state.health.data.filter(item => item.type === type);

export const selectLatestHealthData = (state: RootState) =>
  state.health.data.slice(0, 10); // Get latest 10 entries

export const selectHealthDataByDateRange = (startDate: string, endDate: string) => (state: RootState) =>
  state.health.data.filter(item =>
    item.timestamp >= startDate && item.timestamp <= endDate
  );

export default healthSlice.reducer;