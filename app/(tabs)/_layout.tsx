import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import { useEffect } from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useTranslation } from "react-i18next";
import { useSession } from "../../hooks/useSession";
import { useRootNavigationState, router, useNavigation } from "expo-router";
import HomeScreen from ".";
import LearnScreen from "./learn";
import SettingsScreen from "./settings";
import { selectLanguage } from "../../store/appSlice";
import { useSelector } from "react-redux";
import { useAppTheme } from "../../theme/theme";

export default function TabLayout() {
  const { t } = useTranslation();
  const rootNativationState = useRootNavigationState();
  const language = useSelector(selectLanguage);
  const theme = useAppTheme();

  const Tab = createMaterialBottomTabNavigator();
  const { checkSession } = useSession();

  // language check guard
  useEffect(() => {
    if (!rootNativationState?.key) return;
    if (!language) {
      router.replace("/common/language");
      return;
    } else {
      console.log("check session");
      checkSession().then((isSessionVaild) => {
        if (!isSessionVaild) {
          router.replace("/auth/login");
        }
      });
    }
  }, [rootNativationState?.key, language]);

  return (
    <Tab.Navigator initialRouteName="home" theme={theme}>
      <Tab.Screen
        name="home"
        component={HomeScreen}
        options={{
          tabBarLabel: t("comm:Home"),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="home" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="learn"
        component={LearnScreen}
        options={{
          tabBarLabel: t("comm:Learn"),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="book" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="settings"
        component={SettingsScreen}
        options={{
          tabBarLabel: t("comm:Settings"),
          tabBarIcon: ({ color }) => (
            <MaterialCommunityIcons name="cog" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}
