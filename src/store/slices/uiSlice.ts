import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UIState } from '@/types/common';
import { RootState } from '../index';

const initialState: UIState = {
  theme: 'light',
  language: 'zh-CN',
  isOnline: true,
  activeScreen: 'HealthTab',
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<'light' | 'dark'>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setActiveScreen: (state, action: PayloadAction<string>) => {
      state.activeScreen = action.payload;
    },
    toggleTheme: (state) => {
      state.theme = state.theme === 'light' ? 'dark' : 'light';
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setOnlineStatus,
  setActiveScreen,
  toggleTheme,
} = uiSlice.actions;

// Selectors
export const selectTheme = (state: RootState) => state.ui.theme;
export const selectLanguage = (state: RootState) => state.ui.language;
export const selectIsOnline = (state: RootState) => state.ui.isOnline;
export const selectActiveScreen = (state: RootState) => state.ui.activeScreen;

export default uiSlice.reducer;