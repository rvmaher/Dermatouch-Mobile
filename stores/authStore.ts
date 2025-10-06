import { apiClient } from "@/lib/api";
import { queryClient } from "@/lib/queries";
import { User } from "@/lib/types";
import { Toast } from "@/utils/toast";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";
import { create } from "zustand";
import { useCartStore } from "./cartStore";

interface AuthState {
  user: User | null;
  isLoading: boolean;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  loadUser: () => Promise<void>;
  setHydrated: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isLoading: true,
  isHydrated: Platform.OS !== "web",

  setHydrated: () => set({ isHydrated: true }),

  loadUser: async () => {
    try {
      const token = await SecureStore.getItemAsync("accessToken");
      if (token) {
        const user = await apiClient.getProfile();
        set({ user });
      }
    } catch (error) {
      console.error("Failed to load user:", error);
      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");
    } finally {
      set({ isLoading: false });
    }
  },

  login: async (email: string, password: string) => {
    try {
      const authResponse = await apiClient.login({ email, password });
      set({ user: authResponse.user });
      Toast.success("Welcome back!", "You've been logged in successfully");
    } catch (error) {
      console.error("Login failed:", error);
      Toast.error(
        "Login failed",
        "Please check your credentials and try again"
      );
      throw error;
    }
  },

  register: async (email: string, password: string) => {
    try {
      const authResponse = await apiClient.register({ email, password });
      set({ user: authResponse.user });
      Toast.success("Account created!", "Welcome to Dermatouch");
    } catch (error) {
      console.error("Registration failed:", error);
      Toast.error("Registration failed", "Please try again");
      throw error;
    }
  },

  logout: async () => {
    try {
      await apiClient.logout();

      await SecureStore.deleteItemAsync("accessToken");
      await SecureStore.deleteItemAsync("refreshToken");

      useCartStore.getState().clearUserData();

      queryClient.clear();

      Toast.info("Logged out", "See you next time!");
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      set({ user: null });
    }
  },
}));

export type { User };
