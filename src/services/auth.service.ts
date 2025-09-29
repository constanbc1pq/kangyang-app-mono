import axios from 'axios';
import { Storage } from '../utils/storage';

export interface LoginRequest {
  phone?: string;
  email?: string;
  password?: string;
  verificationCode?: string;
  loginType: 'phone' | 'email';
}

export interface LoginResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
    user: {
      id: string;
      phone?: string;
      email?: string;
      name?: string;
      avatar?: string;
    };
  };
  message: string;
}

export interface SendCodeRequest {
  phone: string;
}

export interface SendCodeResponse {
  success: boolean;
  message: string;
}

export interface RefreshTokenResponse {
  success: boolean;
  data: {
    token: string;
    refreshToken: string;
  };
  message: string;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

class AuthService {
  private apiClient = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  constructor() {
    this.setupInterceptors();
  }

  private setupInterceptors() {
    // Request interceptor to add auth token
    this.apiClient.interceptors.request.use(
      (config) => {
        const token = Storage.getAuthToken();
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    // Response interceptor to handle token refresh
    this.apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        if (error.response?.status === 401) {
          const refreshToken = Storage.getRefreshToken();
          if (refreshToken) {
            try {
              const response = await this.refreshToken(refreshToken);
              if (response.success) {
                // Retry the original request with new token
                error.config.headers.Authorization = `Bearer ${response.data.token}`;
                return this.apiClient.request(error.config);
              }
            } catch (refreshError) {
              // Refresh failed, redirect to login
              await this.logout();
            }
          }
        }
        return Promise.reject(error);
      }
    );
  }

  async login(request: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await this.apiClient.post<LoginResponse>('/auth/login', request);

      if (response.data.success) {
        // Store tokens securely
        Storage.setAuthToken(response.data.data.token);
        Storage.setRefreshToken(response.data.data.refreshToken);
        Storage.set('user_info', response.data.data.user);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('网络连接失败，请检查网络设置');
    }
  }

  async sendVerificationCode(request: SendCodeRequest): Promise<SendCodeResponse> {
    try {
      const response = await this.apiClient.post<SendCodeResponse>('/auth/send-code', request);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('发送验证码失败，请稍后重试');
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await this.apiClient.post<RefreshTokenResponse>('/auth/refresh', {
        refreshToken,
      });

      if (response.data.success) {
        // Update stored tokens
        Storage.setAuthToken(response.data.data.token);
        Storage.setRefreshToken(response.data.data.refreshToken);
      }

      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Token刷新失败');
    }
  }

  async logout(): Promise<void> {
    try {
      const refreshToken = Storage.getRefreshToken();
      if (refreshToken) {
        await this.apiClient.post('/auth/logout', { refreshToken });
      }
    } catch (error) {
      // Ignore logout API errors, still clear local storage
    } finally {
      // Clear all stored auth data
      Storage.removeAuthToken();
      Storage.removeRefreshToken();
      Storage.remove('user_info');
    }
  }

  async getCurrentUser() {
    try {
      const userInfo = Storage.getObject('user_info');
      if (userInfo) {
        return userInfo;
      }

      // Fetch from API if not in storage
      const response = await this.apiClient.get('/auth/profile');
      if (response.data.success) {
        Storage.set('user_info', response.data.data);
        return response.data.data;
      }
    } catch (error) {
      return null;
    }
  }

  async isAuthenticated(): Promise<boolean> {
    try {
      const token = Storage.getAuthToken();
      if (!token) return false;

      // Verify token with server
      const response = await this.apiClient.get('/auth/verify');
      return response.data.success;
    } catch (error) {
      return false;
    }
  }
}

export const authService = new AuthService();