import FontAwesome from "@expo/vector-icons/FontAwesome";
import { lightTheme, darkTheme } from "../theme/theme";
import { useFonts } from "expo-font";
import { SplashScreen, Stack, useRootNavigationState } from "expo-router";
import { useEffect, useMemo } from "react";
import { useColorScheme } from "react-native";
import { PaperProvider } from "react-native-paper";
import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import translations from "../translation";
import {
  Provider as StoreProvider,
  useDispatch,
  useSelector,
} from "react-redux";
import store, { AppDispatch, persistor } from "../store";
import { selectLanguage, selectTheme, setTheme } from "../store/appSlice";
import { StatusBar } from "expo-status-bar";
import { PersistGate } from "redux-persist/integration/react";
import { useNotification } from "../hooks/useNotification";
import { NotificationProvider } from "../store/NotificationContext";
import { TipProvider } from "../store/TipContext";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: "(tabs)",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

i18n.use(initReactI18next).init({
  ns: ["comm", "test", "trans", "acc", "route", "home", "tip"],
  compatibilityJSON: "v3",
  resources: translations,
  lng: "en-AU",
  fallbackLng: "zh-CN",
  interpolation: {
    escapeValue: false,
  },
});
/**
 * redux wrapper for the root layout
 * for making the child component able to access the redux store
 */
export default function RootLayoutWithStore() {
  return (
    <StoreProvider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <RootLayout />
      </PersistGate>
    </StoreProvider>
  );
}

export function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  const colorScheme = useColorScheme();
  const appTheme = useSelector(selectTheme);
  const appLang = useSelector(selectLanguage);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!appTheme) {
      if (colorScheme === "dark") {
        dispatch(setTheme({ theme: "dark" }));
      } else {
        dispatch(setTheme({ theme: "light" }));
      }
    }
    switch (appLang) {
      case "en-AU":
        i18n.changeLanguage("en-AU");
        break;
      case "zh-CN":
        i18n.changeLanguage("zh-CN");
        break;
      case "hi-IN":
        i18n.changeLanguage("hi-IN");
      default:
        i18n.changeLanguage("en-AU");
    }
  }, [colorScheme, appLang, appTheme]);

  const theme = useMemo(() => {
    switch (appTheme) {
      case "light":
        return lightTheme;
      case "dark":
        return darkTheme;
      default:
        if (colorScheme === "dark") {
          return darkTheme;
        } else {
          return lightTheme;
        }
    }
  }, [appTheme, colorScheme]);

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
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

  return (
    <PaperProvider theme={theme}>
      <NotificationProvider>
        <TipProvider>
          <StatusBar style={theme.dark ? "light" : "dark"} translucent />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="(tabs)" />
            <Stack.Screen name="common/language" />
            <Stack.Screen name="common/intro" />
            <Stack.Screen name="auth/access" />
            <Stack.Screen name="auth/login" />
            <Stack.Screen name="auth/register" />
            <Stack.Screen name="route/activity" />
            <Stack.Screen name="route/location" />
            <Stack.Screen name="route/prompt" />
            <Stack.Screen name="route/result" />
            <Stack.Screen name="track/track" />
            <Stack.Screen name="achievement/list" />
            <Stack.Screen name="achievement/ranking" />
            <Stack.Screen name="modal" options={{ presentation: "modal" }} />
          </Stack>
        </TipProvider>
      </NotificationProvider>
    </PaperProvider>
  );
}
