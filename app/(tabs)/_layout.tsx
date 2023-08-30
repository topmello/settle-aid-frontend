import { Link, Tabs } from "expo-router";
import { Pressable, useColorScheme } from "react-native";
import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";

import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  const Tab = createMaterialBottomTabNavigator();

  return (
    <Tab.Navigator initialRouteName="index">
      <Tab.Screen name="Home" component={require("./index").default} options={{
        tabBarIcon: ({ color }) => 
         <MaterialCommunityIcons name="home" color={color} size={26} />,
      }} />
      <Tab.Screen name="Learn" component={require("./two").default} options={{
        tabBarIcon: ({ color }) =>
          <MaterialCommunityIcons name="book" color={color} size={26} />,
      }} />
      <Tab.Screen name="Settings" component={require("./result").default} options={{
        tabBarIcon: ({ color }) =>
          <MaterialCommunityIcons name="cog" color={color} size={26} />,
      }}/>
    </Tab.Navigator>
  );
}
