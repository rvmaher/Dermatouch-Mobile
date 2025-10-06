import { useAuthStore } from "@/stores/authStore";
import { useCartStore } from "@/stores/cartStore";
import { useFonts } from "@/hooks/useFonts";
import { QueryProvider } from "@/lib/query-client";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import { Platform } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Toaster } from "sonner-native";

SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user, isLoading, isHydrated, loadUser, setHydrated } = useAuthStore();
  const { loadCart, setHydrated: setCartHydrated } = useCartStore();
  const segments = useSegments();
  const router = useRouter();
  const fontsLoaded = useFonts();

  useEffect(() => {
    if (Platform.OS === "web") {
      setHydrated();
      setCartHydrated();
    }
  }, [setHydrated, setCartHydrated]);

  useEffect(() => {
    if (isHydrated) {
      loadUser();
    }
  }, [isHydrated, loadUser]);

  useEffect(() => {
    if (user && isHydrated) {
      loadCart();
    }
  }, [user, isHydrated, loadCart]);

  useEffect(() => {
    if (isLoading || !isHydrated) return;

    const inAuthGroup = segments[0] === "auth";

    if (!user && !inAuthGroup) {
      router.replace("/auth");
    } else if (user && inAuthGroup) {
      router.replace("/(tabs)");
    }
  }, [user, isLoading, isHydrated, segments, router]);

  if (isLoading || !isHydrated || !fontsLoaded) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerBackTitle: "Back" }}>
      <Stack.Screen name="auth" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="order-tracking/[orderid]" options={{ headerShown: false }} />
    </Stack>
  );
}

export default function RootLayout() {
  useEffect(() => {
    SplashScreen.hideAsync();
  }, []);

  return (
    <QueryProvider>
      <GestureHandlerRootView>
        <RootLayoutNav />
        <Toaster />
      </GestureHandlerRootView>
    </QueryProvider>
  );
}
