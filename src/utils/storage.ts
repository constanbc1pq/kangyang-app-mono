import { Platform } from 'react-native';
import { APP_CONFIG } from '@/constants/app';

// Platform-specific storage interface
interface StorageInterface {
  set(key: string, value: string): void;
  getString(key: string): string | null | undefined;
  delete(key: string): void;
  clearAll(): void;
}

// Web Storage implementation using localStorage
class WebStorage implements StorageInterface {
  private prefix: string;

  constructor(prefix: string) {
    this.prefix = prefix;
  }

  set(key: string, value: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.setItem(`${this.prefix}:${key}`, value);
      }
    } catch (error) {
      console.error('WebStorage set error:', error);
    }
  }

  getString(key: string): string | null {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        return localStorage.getItem(`${this.prefix}:${key}`);
      }
      return null;
    } catch (error) {
      console.error('WebStorage get error:', error);
      return null;
    }
  }

  delete(key: string): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        localStorage.removeItem(`${this.prefix}:${key}`);
      }
    } catch (error) {
      console.error('WebStorage delete error:', error);
    }
  }

  clearAll(): void {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const keysToRemove: string[] = [];
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith(this.prefix)) {
            keysToRemove.push(key);
          }
        }
        keysToRemove.forEach(key => localStorage.removeItem(key));
      }
    } catch (error) {
      console.error('WebStorage clearAll error:', error);
    }
  }
}

// Create storage instances
// For Web, always use WebStorage
// For Native, import MMKV without encryption first, then conditionally add it
let storage: StorageInterface;
let secureStorage: StorageInterface;

// Initialize storage based on platform
function initializeStorage() {
  if (Platform.OS === 'web') {
    // Use localStorage for web
    storage = new WebStorage('kangyang-app-storage');
    secureStorage = new WebStorage('kangyang-secure-storage');
  } else {
    // Dynamically import MMKV for native platforms only
    try {
      const { MMKV } = require('react-native-mmkv');

      // For native platforms, we can use encryption
      storage = new MMKV({
        id: 'kangyang-app-storage',
        encryptionKey: 'kangyang-health-app-encryption-key',
      });
      secureStorage = new MMKV({
        id: 'kangyang-secure-storage',
        encryptionKey: 'kangyang-health-app-secure-key',
      });
    } catch (error) {
      console.error('Failed to initialize MMKV, falling back to WebStorage', error);
      // Fallback to WebStorage if MMKV fails
      storage = new WebStorage('kangyang-app-storage');
      secureStorage = new WebStorage('kangyang-secure-storage');
    }
  }
}

// Initialize storage immediately
initializeStorage();

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