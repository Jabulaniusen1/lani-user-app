import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider as NavigationThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";
import { CartProvider } from "@/components/CartContext";
import { NotificationProvider } from "@/components/NotificationContext";
import { Provider } from "react-redux";
import { store } from "@/redux/store";
import { SessionProvider, useSession } from "../auth/ctx";
import { SplashScreenController } from "../auth/splash";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { DataProvider } from "../contexts/DataContext";
import { ThemeProvider } from "../contexts/ThemeContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function Root() {
  return (
    <NotificationProvider>
      <SessionProvider>
        <SplashScreenController />
        <SafeAreaProvider>
          <RootLayout />
        </SafeAreaProvider>
      </SessionProvider>
    </NotificationProvider>
  );
}

function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    BricolageGrotesque: require("../assets/fonts/BricolageGrotesque_24pt-Bold.ttf"),
  });

  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session } = useSession();

  console.log('📱 [App] RootLayoutNav rendering with session:', !!session);

  return (
    <Provider store={store}>
      <ThemeProvider>
        <DataProvider>
          <CartProvider>
            <NavigationThemeProvider
              value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
            >
              <Stack>
                <Stack.Screen name="onboarding" options={{ headerShown: false }} />
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="modal" options={{ presentation: "modal" }} />
                <Stack.Screen
                  name="restaurant/[id]"
                  options={{ headerShown: false }}
                />
                <Stack.Screen name="meal/[id]" options={{ headerShown: false }} />
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                <Stack.Screen
                  name="(protected)"
                  options={{ headerShown: false }}
                />
              </Stack>
            </NavigationThemeProvider>
          </CartProvider>
        </DataProvider>
      </ThemeProvider>
    </Provider>
  );
}
