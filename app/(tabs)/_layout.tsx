import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useTranslation } from "react-i18next";

export default function TabLayout() {
  const { t } = useTranslation();

  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName="Home">
      <Tab.Screen name={t("comm:Home")} component={require("./index").default} options={{
        tabBarIcon: ({ color }) => 
         <MaterialCommunityIcons name="home" color={color} size={26} />,
      }} />
      <Tab.Screen name={t("comm:Learn")} component={require("./learn").default} options={{
        tabBarIcon: ({ color }) =>
          <MaterialCommunityIcons name="book" color={color} size={26} />,
      }} />
      <Tab.Screen name={t("comm:Settings")} component={require("./settings").default} options={{
        tabBarIcon: ({ color }) =>
          <MaterialCommunityIcons name="cog" color={color} size={26} />,
      }}/>
    </Tab.Navigator>
  );
}
