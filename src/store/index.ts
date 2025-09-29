import { configureStore } from '@reduxjs/toolkit';
import { setupListeners } from '@reduxjs/toolkit/query';
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
  PersistConfig,
} from 'redux-persist';
import { MMKV } from 'react-native-mmkv';

// Import reducers
import authSlice from './slices/authSlice';
import userSlice from './slices/userSlice';
import healthSlice from './slices/healthSlice';
import deviceSlice from './slices/deviceSlice';
import notificationSlice from './slices/notificationSlice';
import uiSlice from './slices/uiSlice';

// Import types
import { AuthState, UserState, UIState } from '@/types/common';

// Import API slices
import { authApi } from './api/authApi';
import { healthApi } from './api/healthApi';
import { userApi } from './api/userApi';
import { deviceApi } from './api/deviceApi';

// MMKV storage instance
const storage = new MMKV({
  id: 'kangyang-app-storage',
  encryptionKey: 'kangyang-health-app-encryption-key',
});

// Redux persist storage adapter
const reduxStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
    return Promise.resolve(true);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return Promise.resolve(value || null);
  },
  removeItem: (key: string) => {
    storage.delete(key);
    return Promise.resolve();
  },
};

// Persist configurations
const authPersistConfig: PersistConfig<AuthState> = {
  key: 'auth',
  storage: reduxStorage,
  whitelist: ['token', 'refreshToken', 'isAuthenticated'],
};

const userPersistConfig: PersistConfig<UserState> = {
  key: 'user',
  storage: reduxStorage,
  whitelist: ['profile'],
};

const uiPersistConfig: PersistConfig<UIState> = {
  key: 'ui',
  storage: reduxStorage,
  whitelist: ['theme', 'language'],
};

// Root reducer combining all reducers
const rootReducer = {
  // Persisted reducers
  auth: persistReducer(authPersistConfig, authSlice),
  user: persistReducer(userPersistConfig, userSlice),
  ui: persistReducer(uiPersistConfig, uiSlice),

  // Non-persisted reducers
  health: healthSlice,
  devices: deviceSlice,
  notifications: notificationSlice,

  // API reducers
  [authApi.reducerPath]: authApi.reducer,
  [healthApi.reducerPath]: healthApi.reducer,
  [userApi.reducerPath]: userApi.reducer,
  [deviceApi.reducerPath]: deviceApi.reducer,
};

// Create the store
export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(
      authApi.middleware,
      healthApi.middleware,
      userApi.middleware,
      deviceApi.middleware
    ),
  devTools: __DEV__,
});

// Setup listeners for RTK Query
setupListeners(store.dispatch);

// Create persistor
export const persistor = persistStore(store);

// Export types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Clear all persisted data (useful for logout)
export const clearPersistedData = () => {
  persistor.purge();
  storage.clearAll();
};