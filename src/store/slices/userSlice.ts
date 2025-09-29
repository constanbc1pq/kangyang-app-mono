import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { UserState, User, FamilyMember } from '@/types/common';
import { RootState } from '../index';

const initialState: UserState = {
  profile: null,
  familyMembers: [],
  isLoading: false,
  error: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setProfile: (state, action: PayloadAction<User>) => {
      state.profile = action.payload;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.profile) {
        state.profile = { ...state.profile, ...action.payload };
      }
    },
    setFamilyMembers: (state, action: PayloadAction<FamilyMember[]>) => {
      state.familyMembers = action.payload;
    },
    addFamilyMember: (state, action: PayloadAction<FamilyMember>) => {
      state.familyMembers.push(action.payload);
    },
    updateFamilyMember: (state, action: PayloadAction<{ id: string; updates: Partial<FamilyMember> }>) => {
      const index = state.familyMembers.findIndex(member => member.id === action.payload.id);
      if (index !== -1) {
        state.familyMembers[index] = { ...state.familyMembers[index], ...action.payload.updates };
      }
    },
    removeFamilyMember: (state, action: PayloadAction<string>) => {
      state.familyMembers = state.familyMembers.filter(member => member.id !== action.payload);
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearUserData: (state) => {
      state.profile = null;
      state.familyMembers = [];
      state.error = null;
      state.isLoading = false;
    },
  },
});

export const {
  setLoading,
  setProfile,
  updateProfile,
  setFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  removeFamilyMember,
  setError,
  clearError,
  clearUserData,
} = userSlice.actions;

// Selectors
export const selectUser = (state: RootState) => state.user;
export const selectUserProfile = (state: RootState) => state.user.profile;
export const selectFamilyMembers = (state: RootState) => state.user.familyMembers;
export const selectUserLoading = (state: RootState) => state.user.isLoading;
export const selectUserError = (state: RootState) => state.user.error;

export default userSlice.reducer;