import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DeviceState, Device } from '@/types/common';
import { RootState } from '../index';

const initialState: DeviceState = {
  devices: [],
  isScanning: false,
  isLoading: false,
  error: null,
};

const deviceSlice = createSlice({
  name: 'devices',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setScanning: (state, action: PayloadAction<boolean>) => {
      state.isScanning = action.payload;
    },
    setDevices: (state, action: PayloadAction<Device[]>) => {
      state.devices = action.payload;
      state.error = null;
    },
    addDevice: (state, action: PayloadAction<Device>) => {
      state.devices.push(action.payload);
    },
    updateDevice: (state, action: PayloadAction<{ id: string; updates: Partial<Device> }>) => {
      const index = state.devices.findIndex(device => device.id === action.payload.id);
      if (index !== -1) {
        state.devices[index] = { ...state.devices[index], ...action.payload.updates };
      }
    },
    removeDevice: (state, action: PayloadAction<string>) => {
      state.devices = state.devices.filter(device => device.id !== action.payload);
    },
    updateDeviceConnection: (state, action: PayloadAction<{ id: string; isConnected: boolean; batteryLevel?: number }>) => {
      const index = state.devices.findIndex(device => device.id === action.payload.id);
      if (index !== -1) {
        state.devices[index].isConnected = action.payload.isConnected;
        if (action.payload.batteryLevel !== undefined) {
          state.devices[index].batteryLevel = action.payload.batteryLevel;
        }
      }
    },
    updateLastSyncTime: (state, action: PayloadAction<{ id: string; timestamp: string }>) => {
      const index = state.devices.findIndex(device => device.id === action.payload.id);
      if (index !== -1) {
        state.devices[index].lastSyncTime = action.payload.timestamp;
      }
    },
    setError: (state, action: PayloadAction<string>) => {
      state.error = action.payload;
      state.isLoading = false;
      state.isScanning = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearDevices: (state) => {
      state.devices = [];
      state.error = null;
      state.isLoading = false;
      state.isScanning = false;
    },
  },
});

export const {
  setLoading,
  setScanning,
  setDevices,
  addDevice,
  updateDevice,
  removeDevice,
  updateDeviceConnection,
  updateLastSyncTime,
  setError,
  clearError,
  clearDevices,
} = deviceSlice.actions;

// Selectors
export const selectDevices = (state: RootState) => state.devices;
export const selectDevicesList = (state: RootState) => state.devices.devices;
export const selectDevicesLoading = (state: RootState) => state.devices.isLoading;
export const selectDevicesScanning = (state: RootState) => state.devices.isScanning;
export const selectDevicesError = (state: RootState) => state.devices.error;

// Advanced selectors
export const selectConnectedDevices = (state: RootState) =>
  state.devices.devices.filter(device => device.isConnected);

export const selectDevicesByType = (type: string) => (state: RootState) =>
  state.devices.devices.filter(device => device.type === type);

export const selectDeviceById = (id: string) => (state: RootState) =>
  state.devices.devices.find(device => device.id === id);

export default deviceSlice.reducer;