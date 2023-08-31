import FontAwesome from "@expo/vector-icons/FontAwesome";
import { lightTheme, darkTheme } from "../theme/theme";
import { useFonts } from "expo-font";
import { SplashScreen, Stack } from "expo-router";
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
import store, { AppDispatch } from "../store";
import { selectTheme, setTheme } from "../store/appSlice";
import { StatusBar } from "expo-status-bar";

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
  ns: ["test", "common", "account", "route", "home", "tip"],
  compatibilityJSON: "v3",
  resources: translations,
  lng: "zh-CN",
  fallbackLng: "en-AU",
  interpolation: {
    escapeValue: false,
  },
});

/**
 * redux wrapper for the root layout
 * for making the child component able to access the redux store
 */
export default function RootLayoutStore() {
  return (
    <StoreProvider store={store}>
      <RootLayout />
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
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (colorScheme === "dark") {
      dispatch(setTheme({ theme: "dark"}));
    } else {
      dispatch(setTheme({ theme: "dark"}));
    }
  }, [colorScheme]);

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
      <StatusBar style={theme.dark ? "light" : "dark"} />
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="modal" options={{ presentation: "modal" }} />
      </Stack>
    </PaperProvider>
  );
}
