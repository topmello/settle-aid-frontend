import FontAwesome from '@expo/vector-icons/FontAwesome';
import { lightTheme, darkTheme } from '../constants/theme';
import { useFonts } from 'expo-font';
import { SplashScreen, Stack } from 'expo-router';
import { useEffect } from 'react';
import { useColorScheme } from 'react-native';
import { PaperProvider } from 'react-native-paper';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import translations from '../translation';
import { Provider as StoreProvider } from 'react-redux';
import store from '../store';

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from 'expo-router';

export const unstable_settings = {
  // Ensure that reloading on `/modal` keeps a back button present.
  initialRouteName: '(tabs)',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

i18n.use(initReactI18next)
  .init({
    ns: ['test', 'common', 'account', 'route', 'home', 'tip'],
    compatibilityJSON: 'v3',
    resources: translations,
    lng: "zh-CN",
    fallbackLng: "en-AU",
    interpolation: {
      escapeValue: false
    } 
  });

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    ...FontAwesome.font,
  });

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

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <StoreProvider store={store}>
      <PaperProvider theme={colorScheme === 'dark' ? darkTheme : lightTheme }>
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="modal" options={{ presentation: 'modal' }} />
            <Stack.Screen name="locale" options={{ headerShown: false }} />
          </Stack>
      </PaperProvider>
    </StoreProvider>
  );
}
