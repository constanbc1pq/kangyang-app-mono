// Common type definitions for the Kangyang Health App

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  phone?: string;
  gender?: 'male' | 'female' | 'other';
  birthDate?: string;
  height?: number; // cm
  weight?: number; // kg
  emergencyContact?: EmergencyContact;
  allergies?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface EmergencyContact {
  name: string;
  relationship: string;
  phone: string;
}

export interface HealthData {
  id: string;
  userId: string;
  type: HealthDataType;
  value: number;
  unit: string;
  timestamp: string;
  deviceId?: string;
  source: DataSource;
  metadata?: Record<string, any>;
}

export type HealthDataType =
  | 'heart_rate'
  | 'blood_pressure'
  | 'blood_sugar'
  | 'weight'
  | 'body_fat'
  | 'steps'
  | 'sleep_duration'
  | 'sleep_quality'
  | 'calories_burned'
  | 'water_intake'
  | 'temperature';

export type DataSource = 'manual' | 'device' | 'sync';

export interface Device {
  id: string;
  name: string;
  type: DeviceType;
  brand: string;
  model: string;
  macAddress?: string;
  isConnected: boolean;
  batteryLevel?: number;
  lastSyncTime?: string;
  userId: string;
}

export type DeviceType =
  | 'smart_scale'
  | 'fitness_tracker'
  | 'blood_pressure_monitor'
  | 'glucometer'
  | 'heart_rate_monitor'
  | 'smart_toilet';

export interface AIReport {
  id: string;
  userId: string;
  title: string;
  content: string;
  type: ReportType;
  generatedAt: string;
  dataRange: {
    startDate: string;
    endDate: string;
  };
  recommendations: Recommendation[];
  riskLevel: RiskLevel;
}

export type ReportType = 'daily' | 'weekly' | 'monthly' | 'custom';
export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

export interface Recommendation {
  id: string;
  category: RecommendationCategory;
  title: string;
  description: string;
  priority: Priority;
  action?: string;
}

export type RecommendationCategory =
  | 'nutrition'
  | 'exercise'
  | 'sleep'
  | 'medical'
  | 'lifestyle'
  | 'mental_health';

export type Priority = 'low' | 'medium' | 'high';

export interface FamilyMember {
  id: string;
  name: string;
  relationship: string;
  avatar?: string;
  permissions: Permission[];
  inviteStatus: InviteStatus;
  userId: string;
}

export type Permission =
  | 'view_basic_health'
  | 'view_detailed_health'
  | 'receive_alerts'
  | 'manage_devices';

export type InviteStatus = 'pending' | 'accepted' | 'declined';

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

export type NotificationType =
  | 'health_alert'
  | 'medication_reminder'
  | 'appointment_reminder'
  | 'device_sync'
  | 'report_ready'
  | 'social_activity'
  | 'system_update';

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: {
    code: string;
    details: any;
  };
  timestamp: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

// Navigation types
export interface NavigationProps {
  navigation: any;
  route: any;
}

// Form validation types
export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Theme types
export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  error: string;
  warning: string;
  success: string;
  info: string;
}

export interface Theme {
  colors: ThemeColors;
  fonts: {
    regular: string;
    medium: string;
    bold: string;
  };
  spacing: {
    xs: number;
    sm: number;
    md: number;
    lg: number;
    xl: number;
  };
}

// Redux store types
export interface RootState {
  auth: AuthState;
  user: UserState;
  health: HealthState;
  devices: DeviceState;
  notifications: NotificationState;
  ui: UIState;
}

export interface AuthState {
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface UserState {
  profile: User | null;
  familyMembers: FamilyMember[];
  isLoading: boolean;
  error: string | null;
}

export interface HealthState {
  data: HealthData[];
  reports: AIReport[];
  isLoading: boolean;
  error: string | null;
  syncStatus: SyncStatus;
}

export interface DeviceState {
  devices: Device[];
  isScanning: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
}

export interface UIState {
  theme: 'light' | 'dark';
  language: string;
  isOnline: boolean;
  activeScreen: string;
}

export type SyncStatus = 'idle' | 'syncing' | 'completed' | 'error';