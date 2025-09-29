import { createAsyncThunk } from '@reduxjs/toolkit';
import { authService, LoginRequest, SendCodeRequest } from '../../services/auth.service';
import { Storage } from '../../utils/storage';
import { loginStart, loginSuccess, loginFailure, logout as logoutAction } from '../slices/authSlice';

export const loginThunk = createAsyncThunk(
  'auth/login',
  async (request: LoginRequest, { dispatch, rejectWithValue }) => {
    try {
      dispatch(loginStart());

      const response = await authService.login(request);

      if (response.success) {
        dispatch(loginSuccess({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        }));

        // Store user data
        dispatch({
          type: 'user/setCurrentUser',
          payload: response.data.user
        });

        return response.data;
      } else {
        dispatch(loginFailure(response.message || '登录失败'));
        return rejectWithValue(response.message || '登录失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '网络连接失败';
      dispatch(loginFailure(errorMessage));
      return rejectWithValue(errorMessage);
    }
  }
);

export const sendVerificationCodeThunk = createAsyncThunk(
  'auth/sendCode',
  async (request: SendCodeRequest, { rejectWithValue }) => {
    try {
      const response = await authService.sendVerificationCode(request);

      if (response.success) {
        return response;
      } else {
        return rejectWithValue(response.message || '发送验证码失败');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '发送验证码失败';
      return rejectWithValue(errorMessage);
    }
  }
);

export const logoutThunk = createAsyncThunk(
  'auth/logout',
  async (_, { dispatch }) => {
    try {
      await authService.logout();
      dispatch(logoutAction());

      // Clear user data
      dispatch({ type: 'user/clearCurrentUser' });

      return true;
    } catch (error) {
      // Even if API call fails, we should clear local auth data
      dispatch(logoutAction());
      dispatch({ type: 'user/clearCurrentUser' });
      return true;
    }
  }
);

export const checkAuthThunk = createAsyncThunk(
  'auth/checkAuth',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const token = Storage.getAuthToken();
      const refreshToken = Storage.getRefreshToken();

      if (!token || !refreshToken) {
        return rejectWithValue('No tokens found');
      }

      const isAuthenticated = await authService.isAuthenticated();

      if (isAuthenticated) {
        dispatch(loginSuccess({ token, refreshToken }));

        // Get user data
        const user = await authService.getCurrentUser();
        if (user) {
          dispatch({ type: 'user/setCurrentUser', payload: user });
        }

        return { token, refreshToken };
      } else {
        // Token is invalid, clear storage
        await authService.logout();
        return rejectWithValue('Token invalid');
      }
    } catch (error) {
      return rejectWithValue('Auth check failed');
    }
  }
);

export const refreshTokenThunk = createAsyncThunk(
  'auth/refreshToken',
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const refreshToken = Storage.getRefreshToken();

      if (!refreshToken) {
        return rejectWithValue('No refresh token');
      }

      const response = await authService.refreshToken(refreshToken);

      if (response.success) {
        dispatch(loginSuccess({
          token: response.data.token,
          refreshToken: response.data.refreshToken,
        }));

        return response.data;
      } else {
        // Refresh failed, logout user
        dispatch(logoutAction());
        return rejectWithValue('Refresh failed');
      }
    } catch (error) {
      dispatch(logoutAction());
      return rejectWithValue('Refresh failed');
    }
  }
);