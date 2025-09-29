import { MMKV } from 'react-native-mmkv';
import { APP_CONFIG } from '@/constants/app';

// Create MMKV instances
const storage = new MMKV({
  id: 'kangyang-app-storage',
  encryptionKey: 'kangyang-health-app-encryption-key',
});

const secureStorage = new MMKV({
  id: 'kangyang-secure-storage',
  encryptionKey: 'kangyang-health-app-secure-key',
});

export class Storage {
  // Basic storage operations
  static set(key: string, value: any): void {
    try {
      if (typeof value === 'string') {
        storage.set(key, value);
      } else {
        storage.set(key, JSON.stringify(value));
      }
    } catch (error) {
      console.error('Storage set error:', error);
    }
  }

  static get(key: string): string | null {
    try {
      return storage.getString(key) || null;
    } catch (error) {
      console.error('Storage get error:', error);
      return null;
    }
  }

  static getObject<T>(key: string): T | null {
    try {
      const value = storage.getString(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error('Storage getObject error:', error);
      return null;
    }
  }

  static remove(key: string): void {
    try {
      storage.delete(key);
    } catch (error) {
      console.error('Storage remove error:', error);
    }
  }

  static clear(): void {
    try {
      storage.clearAll();
    } catch (error) {
      console.error('Storage clear error:', error);
    }
  }

  // Secure storage for sensitive data
  static setSecure(key: string, value: string): void {
    try {
      secureStorage.set(key, value);
    } catch (error) {
      console.error('Secure storage set error:', error);
    }
  }

  static getSecure(key: string): string | null {
    try {
      return secureStorage.getString(key) || null;
    } catch (error) {
      console.error('Secure storage get error:', error);
      return null;
    }
  }

  static removeSecure(key: string): void {
    try {
      secureStorage.delete(key);
    } catch (error) {
      console.error('Secure storage remove error:', error);
    }
  }

  // Auth token management
  static setAuthToken(token: string): void {
    this.setSecure(APP_CONFIG.storage.authToken, token);
  }

  static getAuthToken(): string | null {
    return this.getSecure(APP_CONFIG.storage.authToken);
  }

  static removeAuthToken(): void {
    this.removeSecure(APP_CONFIG.storage.authToken);
  }

  static setRefreshToken(token: string): void {
    this.setSecure(APP_CONFIG.storage.refreshToken, token);
  }

  static getRefreshToken(): string | null {
    return this.getSecure(APP_CONFIG.storage.refreshToken);
  }

  static removeRefreshToken(): void {
    this.removeSecure(APP_CONFIG.storage.refreshToken);
  }

  // User settings
  static setUserSettings(settings: any): void {
    this.set(APP_CONFIG.storage.settings, settings);
  }

  static getUserSettings(): any {
    return this.getObject(APP_CONFIG.storage.settings);
  }
}