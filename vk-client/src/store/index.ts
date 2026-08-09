import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthState {
  accessToken: string | null;
  userId: number | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userId?: number) => Promise<void>;
  logout: () => Promise<void>;
  initAuth: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  userId: null,
  isAuthenticated: false,
  setAuth: async (token: string, userId?: number) => {
    await AsyncStorage.setItem('vk_access_token', token);
    if (userId) {
      await AsyncStorage.setItem('vk_user_id', userId.toString());
    }
    set({ accessToken: token, userId, isAuthenticated: true });
  },
  logout: async () => {
    await AsyncStorage.removeItem('vk_access_token');
    await AsyncStorage.removeItem('vk_user_id');
    set({ accessToken: null, userId: null, isAuthenticated: false });
  },
  initAuth: async () => {
    const token = await AsyncStorage.getItem('vk_access_token');
    const userIdStr = await AsyncStorage.getItem('vk_user_id');
    const userId = userIdStr ? parseInt(userIdStr, 10) : null;
    if (token) {
      set({ accessToken: token, userId, isAuthenticated: true });
    } else {
      set({ isAuthenticated: false });
    }
  },
}));
