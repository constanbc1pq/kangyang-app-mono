import AsyncStorage from '@react-native-async-storage/async-storage';
import { APP_CONFIG } from '@/constants/app';

// Unified AsyncStorage wrapper with prefix support
class UnifiedStorage {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  async set(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(`${this.prefix}:${key}`, value);
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  async getString(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(`${this.prefix}:${key}`);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  async delete(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(`${this.prefix}:${key}`);
    } catch (error) {
      console.error('Storage delete error:', error);
    }
  }

  async clearAll(): Promise<void> {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const keysToRemove = keys.filter(key => key.startsWith(this.prefix));
      await AsyncStorage.multiRemove(keysToRemove);
    } catch (error) {
      console.error('Storage clearAll error:', error);
    }
  }
}

// Create storage instances
const storage = new UnifiedStorage('kangyang-app-storage');
const secureStorage = new UnifiedStorage('kangyang-secure-storage');

export class Storage {
  // Basic storage operations (async)
  static async set(key: string, value: any): Promise<void> {
    try {
      if (typeof value === 'string') {
        await storage.set(key, value);
      } else {
        await storage.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  static async get(key: string): Promise<string | null> {
    try {
      return await storage.getString(key);
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  static async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  }

  static async remove(key: string): Promise<void> {
    try {
      await storage.delete(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  static async clear(): Promise<void> {
    try {
      await storage.clearAll();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Secure storage for sensitive data
  static async setSecure(key: string, value: string): Promise<void> {
    try {
      await secureStorage.set(key, value);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  }

  static async getSecure(key: string): Promise<string | null> {
    try {
      return await secureStorage.getString(key);
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }

  static async removeSecure(key: string): Promise<void> {
    try {
      await secureStorage.delete(key);
    } catch (error) {
      console.error('Secure storage remove error:', error);
    }
  }

  // Auth token management
  static async setAuthToken(token: string): Promise<void> {
    await this.setSecure(APP_CONFIG.storage.authToken, token);
  }

  static async getAuthToken(): Promise<string | null> {
    return await this.getSecure(APP_CONFIG.storage.authToken);
  }

  static async removeAuthToken(): Promise<void> {
    await this.removeSecure(APP_CONFIG.storage.authToken);
  }

  static async setRefreshToken(token: string): Promise<void> {
    await this.setSecure(APP_CONFIG.storage.refreshToken, token);
  }

  static async getRefreshToken(): Promise<string | null> {
    return await this.getSecure(APP_CONFIG.storage.refreshToken);
  }

  static async removeRefreshToken(): Promise<void> {
    await this.removeSecure(APP_CONFIG.storage.refreshToken);
  }

  // User settings
  static async setUserSettings(settings: any): Promise<void> {
    await this.set(APP_CONFIG.storage.settings, settings);
  }

  static async getUserSettings(): Promise<any> {
    return await this.getObject(APP_CONFIG.storage.settings);
  }
}