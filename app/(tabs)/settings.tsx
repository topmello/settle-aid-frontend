//@ts-nocheck
import {
  StyleSheet,
  Appearance,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import { loginUser, logoutUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserToken } from "../../store/authSlice";
import { selectAuthStatus } from "../../store/authSlice";
import { AppDispatch } from "../../store";
import { Button, List, Menu } from "react-native-paper";
import {
  selectTheme,
  setDarkTheme,
  setLightTheme,
  setSystemTheme,
} from "../../store/appSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotification } from "../../hooks/useNotification";
import { useState } from "react";
import { router } from "expo-router";

export default function SettingsScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectUserToken);
  const colorScheme = useColorScheme();
  const theme = useSelector(selectTheme);
  const [themeInputVisible, setThemeInputVisible] = useState(false);
  const { pushNotification } = useNotification();
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ alignItems: "center" }}
        style={{ width: "100%" }}
      >
        <List.Section
          style={{
            width: "100%",
          }}
        >
          <List.Subheader>Appearance</List.Subheader>
          <List.Item
            title="Color Scheme"
            description={colorScheme}
            right={() => {
              return (
                <Menu
                  visible={themeInputVisible}
                  onDismiss={() => setThemeInputVisible(false)}
                  anchor={
                    <Button
                      mode="contained"
                      onPress={() => setThemeInputVisible(true)}
                    >
                      {theme === "light"
                        ? "Light"
                        : theme === "dark"
                        ? "Dark"
                        : "Follow System"}
                    </Button>
                  }
                >
                  <Menu.Item
                    onPress={() => {
                      dispatch(setLightTheme());
                      setThemeInputVisible(false);
                    }}
                    title="Light"
                  />
                  <Menu.Item
                    onPress={() => {
                      dispatch(setDarkTheme());
                      setThemeInputVisible(false);
                    }}
                    title="Dark"
                  />
                  <Menu.Item
                    onPress={() => {
                      dispatch(setSystemTheme());
                      setThemeInputVisible(false);
                    }}
                    title="Follow System"
                  />
                </Menu>
              );
            }}
            left={(props) => <List.Icon {...props} icon="palette" />}
          />
          <List.Item
            title="Language"
            description="Set your language"
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={() => (
              <Button
                mode="contained"
                onPress={() => router.push("/common/language")}
              >
                Change
              </Button>
            )}
          />
        </List.Section>
        <List.Section
          style={{
            width: "100%",
          }}
        >
          <List.Subheader>Account</List.Subheader>
          <List.Item
            title="Logout"
            right={() => {
              return (
                <Button mode="contained" onPress={() => dispatch(logoutUser())}>
                  Logout
                </Button>
              );
            }}
            left={(props) => <List.Icon {...props} icon="logout" />}
          />
        </List.Section>
        <List.Section
          style={{
            width: "100%",
          }}
        >
          <List.Subheader>Development</List.Subheader>
          <List.Item
            title="Test Admin Login"
            left={(props) => <List.Icon {...props} icon="security" />}
            right={() => (
              <Button
                mode="contained"
                onPress={() =>
                  dispatch(loginUser({ username: "admin", password: "admin" }))
                }
              >
                Test
              </Button>
            )}
          />

          <List.Item
            title="Current Token"
            description={token}
            left={(props) => <List.Icon {...props} icon="key" />}
          />
          <List.Item
            title="Go Access Page"
            left={(props) => <List.Icon {...props} icon="key" />}
            right={() => (
              <Button
                mode="contained"
                onPress={() => router.push("/auth/access")}
              >
                Access
              </Button>
            )}
          />
          <List.Item
            title="Test Notificaiton"
            description="Send a test notification"
            left={(props) => <List.Icon {...props} icon="bell" />}
            right={() => {
              return (
                <Button
                  mode="contained"
                  onPress={() => {
                    pushNotification({
                      message: "Hello",
                      type: "info",
                    });
                  }}
                >
                  Test
                </Button>
              );
            }}
          />
        </List.Section>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
  },
});
