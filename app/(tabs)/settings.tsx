//@ts-nocheck
import {
  StyleSheet,
  Appearance,
  useColorScheme,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";
import {
  loginUser,
  logoutUser,
  selectRefreshToken,
  selectRefreshTokenExpiresAt,
  selectTokenExpiresAt,
  selectUserId,
  selectUsername,
} from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectToken } from "../../store/authSlice";
import { AppDispatch } from "../../store";
import { Button, List, Menu, Text, useTheme } from "react-native-paper";
import {
  selectTheme,
  setDarkTheme,
  setLightTheme,
  setSystemTheme,
  selectLanguage,
  setLanguage,
} from "../../store/appSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotification } from "../../hooks/useNotification";
import { useCallback, useState } from "react";
import { router } from "expo-router";
import { languages } from "../common/language";

export default function SettingsScreen() {
  const { t, i18n } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectToken);
  const tokenExpireAt = useSelector(selectTokenExpiresAt);
  const refreshToken = useSelector(selectRefreshToken);
  const refreshTokenExpireAt = useSelector(selectRefreshTokenExpiresAt);
  const authStatus = useSelector((state) => state.auth.status);
  const userId = useSelector(selectUserId);
  const username = useSelector(selectUsername);
  const colorScheme = useColorScheme();
  const theme = useSelector(selectTheme);
  const paperTheme = useTheme();
  const appLanguage = useSelector(selectLanguage);
  const changeLanguage = useCallback(
    (language: "en-AU" | "hi-IN" | "zh-CN") => {
      dispatch(setLanguage({ language }));
      i18n.changeLanguage(language);
    },
    []
  );

  const getLanguageDisplayName = useCallback(
    (lang) => {
      const language = languages.find((l) => l.code === lang);
      if (language) {
        return language.name;
      }
      return "Unknown";
    },
    [languages]
  );
  const [themeInputVisible, setThemeInputVisible] = useState(false);
  const [languageInputVisible, setLanguageInputVisible] = useState(false);

  const [adminAuthStatus, setAdminAuthStatus] = useState("Idle");
  const { pushNotification } = useNotification();
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor: paperTheme.colors.background,
        },
      ]}
    >
      <Text
        style={{
          fontSize: 24,
          fontWeight: "bold",
          width: "100%",
          padding: 16,
          paddingTop: 48,
          color: paperTheme.colors.onBackground,
        }}
      >
        {t("Settings", { ns: "settings" })}
      </Text>
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
          <List.Subheader>{t("Appearance", { ns: "settings" })}</List.Subheader>
          <List.Item
            title={t("Color Scheme", { ns: "settings" })}
            description={t("Set your color scheme", { ns: "settings" })}
            right={() => (
              <Menu
                visible={themeInputVisible}
                onDismiss={() => setThemeInputVisible(false)}
                anchor={
                  <Button
                    mode="contained"
                    onPress={() => setThemeInputVisible(true)}
                  >
                    {theme === "light"
                      ? t("Light", { ns: "settings" })
                      : theme === "dark"
                      ? t("Dark", { ns: "settings" })
                      : t("Follow System", { ns: "settings" })}
                  </Button>
                }
              >
                <Menu.Item
                  onPress={() => {
                    dispatch(setLightTheme());
                    setThemeInputVisible(false);
                  }}
                  title={t("Light", { ns: "settings" })}
                />
                <Menu.Item
                  onPress={() => {
                    dispatch(setDarkTheme());
                    setThemeInputVisible(false);
                  }}
                  title={t("Dark", { ns: "settings" })}
                />
                <Menu.Item
                  onPress={() => {
                    dispatch(setSystemTheme());
                    setThemeInputVisible(false);
                  }}
                  title={t("Follow System", { ns: "settings" })}
                />
              </Menu>
            )}
            left={(props) => <List.Icon {...props} icon="palette" />}
          />
          <List.Item
            title={t("Language", { ns: "settings" })}
            description={t("Set your language", { ns: "settings" })}
            left={(props) => <List.Icon {...props} icon="translate" />}
            right={() => (
              <Menu
                visible={languageInputVisible}
                onDismiss={() => setLanguageInputVisible(false)}
                anchor={
                  <Button
                    mode="contained"
                    onPress={() => setLanguageInputVisible(true)}
                  >
                    {getLanguageDisplayName(appLanguage)}
                  </Button>
                }
              >
                {languages.map((language) => (
                  <Menu.Item
                    key={language.code}
                    onPress={() => {
                      changeLanguage(language.code);
                      setLanguageInputVisible(false);
                    }}
                    title={language.name}
                  />
                ))}
              </Menu>
            )}
          />
        </List.Section>
        <List.Section
          style={{
            width: "100%",
          }}
        >
          <List.Subheader>{t("Account", { ns: "settings" })}</List.Subheader>
          <List.Item
            title={t("Logout", { ns: "settings" })}
            right={() => {
              return (
                <Button mode="contained" onPress={() => dispatch(logoutUser())}>
                  {t("Logout", { ns: "settings" })}
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
          <List.Subheader>
            {t("Development", { ns: "settings" })}
          </List.Subheader>
          <List.Item
            title="Test Admin Login"
            description={adminAuthStatus}
            left={(props) => <List.Icon {...props} icon="security" />}
            right={() => (
              <Button
                mode="contained"
                onPress={() => {
                  setAdminAuthStatus("Loading");
                  dispatch(loginUser({ username: "admin", password: "admin" }))
                    .unwrap()
                    .then(() => {
                      setAdminAuthStatus("Success");
                    })
                    .catch(() => {
                      setAdminAuthStatus("Failed");
                    });
                }}
              >
                Test
              </Button>
            )}
          />
          <List.Item
            title="Go Access Page"
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
            title="Go Track Page"
            right={() => (
              <Button
                mode="contained"
                onPress={() => router.push("/track/track")}
              >
                Track
              </Button>
            )}
          />
          <List.Accordion
            title="Authentication States"
            left={(props) => <List.Icon {...props} icon="key" />}
          >
            <List.Item title="Auth Status" description={authStatus} />
            <List.Item
              title="Current UTC Time"
              description={new Date().toISOString()}
            />
            <List.Item title="Token" description={token} />
            <List.Item title="Id" description={userId} />
            <List.Item title="Username" description={username} />
            <List.Item
              title="Token Expires At"
              description={tokenExpireAt?.toString()}
            />
            <List.Item title="Refresh Token" description={refreshToken} />
            <List.Item
              title="Refresh Token Expires At"
              description={refreshTokenExpireAt?.toString()}
            />
          </List.Accordion>

          <List.Item
            title="Test Notificaiton"
            description="Send a test notification"
            style={{ marginBottom: 16 }}
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
