import AsyncStorage from '@react-native-async-storage/async-storage';

export interface UserProfile {
  name: string;
  email: string;
  bio: string;
  university: string;
  major: string;
  graduationYear: string;
  avatarUri?: string | null;
}

export interface ScheduledSession {
  id: string;
  name: string;
  subject: string;
  durationHours: number;
  durationMinutes: number;
  mode: 'individual' | 'group';
  notes?: string;
  createdAt: string;
}

export interface ActivityRecord {
  id: string;
  routeId: string;
  title: string;
  subject: string;
  duration: string;
  date: string;
  score: string;
  timestamp: number;
}

export interface UserSettings {
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  offlineSync: boolean;
  language: string;
}

const STORAGE_KEYS = {
  PROFILE: '@studymate_user_profile',
  SESSIONS: '@studymate_saved_sessions',
  ACTIVITIES: '@studymate_activity_history',
  SETTINGS: '@studymate_app_settings',
  GEMINI_API_KEY: '@studymate_gemini_api_key',
};

export const DEFAULT_PROFILE: UserProfile = {
  name: 'Alex Johnson',
  email: 'alex@studymate.ai',
  bio: 'Computer Science & Physics student passionate about AI-driven learning.',
  university: 'Stanford University',
  major: 'Computer Science',
  graduationYear: '2026',
  avatarUri: null,
};

export const DEFAULT_SETTINGS: UserSettings = {
  notificationsEnabled: true,
  soundEnabled: true,
  offlineSync: true,
  language: 'English (US)',
};

export const StorageService = {
  // --- Profile ---
  async getProfile(): Promise<UserProfile> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.PROFILE);
      if (data) {
        return { ...DEFAULT_PROFILE, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('StorageService.getProfile error:', e);
    }
    return DEFAULT_PROFILE;
  },

  async saveProfile(profile: Partial<UserProfile>): Promise<UserProfile> {
    try {
      const current = await StorageService.getProfile();
      const updated = { ...current, ...profile };
      await AsyncStorage.setItem(STORAGE_KEYS.PROFILE, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('StorageService.saveProfile error:', e);
      return { ...DEFAULT_PROFILE, ...profile };
    }
  },

  // --- Scheduled Sessions ---
  async getSessions(): Promise<ScheduledSession[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SESSIONS);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService.getSessions error:', e);
    }
    return [];
  },

  async addSession(session: Omit<ScheduledSession, 'id' | 'createdAt'>): Promise<ScheduledSession> {
    const newSession: ScheduledSession = {
      ...session,
      id: 'session_' + Date.now(),
      createdAt: new Date().toISOString(),
    };
    try {
      const current = await StorageService.getSessions();
      const updated = [newSession, ...current];
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(updated));
    } catch (e) {
      console.warn('StorageService.addSession error:', e);
    }
    return newSession;
  },

  async deleteSession(sessionId: string): Promise<void> {
    try {
      const current = await StorageService.getSessions();
      const filtered = current.filter((s) => s.id !== sessionId);
      await AsyncStorage.setItem(STORAGE_KEYS.SESSIONS, JSON.stringify(filtered));
    } catch (e) {
      console.warn('StorageService.deleteSession error:', e);
    }
  },

  // --- Activity Records ---
  async getActivities(): Promise<ActivityRecord[]> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.ACTIVITIES);
      if (data) {
        return JSON.parse(data);
      }
    } catch (e) {
      console.warn('StorageService.getActivities error:', e);
    }
    return [];
  },

  async saveActivity(activity: Omit<ActivityRecord, 'id' | 'timestamp'>): Promise<ActivityRecord> {
    const record: ActivityRecord = {
      ...activity,
      id: 'act_' + Date.now(),
      timestamp: Date.now(),
    };
    try {
      const current = await StorageService.getActivities();
      const updated = [record, ...current].slice(0, 50); // retain last 50
      await AsyncStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updated));
    } catch (e) {
      console.warn('StorageService.saveActivity error:', e);
    }
    return record;
  },

  // --- Settings ---
  async getSettings(): Promise<UserSettings> {
    try {
      const data = await AsyncStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) {
        return { ...DEFAULT_SETTINGS, ...JSON.parse(data) };
      }
    } catch (e) {
      console.warn('StorageService.getSettings error:', e);
    }
    return DEFAULT_SETTINGS;
  },

  async saveSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    try {
      const current = await StorageService.getSettings();
      const updated = { ...current, ...settings };
      await AsyncStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
      return updated;
    } catch (e) {
      console.warn('StorageService.saveSettings error:', e);
      return { ...DEFAULT_SETTINGS, ...settings };
    }
  },

  // --- Gemini API Key ---
  async getGeminiApiKey(): Promise<string> {
    try {
      const key = await AsyncStorage.getItem(STORAGE_KEYS.GEMINI_API_KEY);
      if (key) return key;
    } catch (e) {
      console.warn('StorageService.getGeminiApiKey error:', e);
    }
    return process.env.EXPO_PUBLIC_GEMINI_API_KEY || '';
  },

  async saveGeminiApiKey(key: string): Promise<void> {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.GEMINI_API_KEY, key.trim());
    } catch (e) {
      console.warn('StorageService.saveGeminiApiKey error:', e);
    }
  },

  async clearGeminiApiKey(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.GEMINI_API_KEY);
    } catch (e) {
      console.warn('StorageService.clearGeminiApiKey error:', e);
    }
  },
};
