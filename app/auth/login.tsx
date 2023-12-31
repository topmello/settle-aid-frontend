import * as React from "react";
import {
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity,
} from "react-native";
import { router } from "expo-router";
import {
  Card,
  RadioButton,
  Text,
  useTheme,
  Button,
  TextInput,
  HelperText,
  Snackbar,
} from "react-native-paper";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import WavingHandIcon from "../../assets/images/icons/waving_hand.svg";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { loginUser as loginUserThunk } from "../../store/authSlice";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNotification } from "../../hooks/useNotification";

// for default route to home screen
export const unstable_settings = {
  initialRouteName: "index",
};

export default function LoginPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [username, setUsername] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [logining, setLogining] = React.useState(false);

  const { pushNotification } = useNotification();

  const dispatch = useDispatch<AppDispatch>();

  const loginUser = React.useCallback(async () => {
    setLogining(true);
    if (username === "" || password === "") {
      pushNotification({
        message: t("Please fill in all fields", { ns: "acc" }),
        type: "warning",
      });
      setLogining(false);
    } else {
      dispatch(loginUserThunk({ username, password }))
        .unwrap()
        .then(() => {
          router.replace("/(tabs)");
        })
        .catch((err) => {
          switch (err.code) {
            case "ERR_BAD_REQUEST":
              pushNotification({
                message: t("Invalid username or password", { ns: "acc" }),
                type: "error",
              });
              break;
            case "ERR_NETWORK":
              pushNotification({
                message: t("Network Error", { ns: "comm" }),
                type: "error",
              });
              break;
            default:
              console.error(err);
          }
        });
      setLogining(false);
    }
  }, [username, password]);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.primaryContainer,
        flex: 1,
        flexDirection: "column",
        padding: 20,
      }}
    >
      <View
        style={{
          marginTop: 32,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        {router.canGoBack() ? (
          <TouchableOpacity
            onPress={() => {
              router.back();
            }}
          >
            <ArrowBackIcon
              fill={theme.colors.onPrimaryContainer}
              width={34}
              height={34}
            />
          </TouchableOpacity>
        ) : (
          <View></View>
        )}
        <WavingHandIcon
          fill={theme.colors.onPrimaryContainer}
          width={64}
          height={64}
        />
      </View>
      <Text
        variant="headlineLarge"
        style={{
          marginTop: 36,
          color: theme.colors.onPrimaryContainer,
          fontWeight: "bold",
        }}
      >
        {t("Welcome back,", { ns: "acc" })}
      </Text>
      <Text
        variant="headlineLarge"
        style={{
          marginTop: 12,
          color: theme.colors.onPrimaryContainer,
        }}
      >
        {t("Let's Sign in", { ns: "acc" })}
      </Text>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, justifyContent: "center", gap: 16 }}
      >
        <View>
          <TextInput
            autoComplete="username"
            theme={{
              colors: {
                background: theme.colors.primaryContainer,
              },
            }}
            mode="outlined"
            label={t("Username", { ns: "acc" })}
            style={{ backgroundColor: "transparent", height: 56 }}
            value={username}
            onChangeText={(text) => {
              setUsername(text);
            }}
          />
        </View>
        <View>
          <TextInput
            autoComplete="password"
            theme={{
              colors: {
                background: theme.colors.primaryContainer,
              },
            }}
            mode="outlined"
            label={t("Password", { ns: "acc" })}
            style={{ backgroundColor: "transparent", height: 56 }}
            value={password}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                style={{ marginTop: 12 }}
                icon={showPassword ? "eye-off" : "eye"}
                onPress={() => {
                  setShowPassword(!showPassword);
                }}
              />
            }
            onChangeText={(text) => {
              setPassword(text);
            }}
          />
        </View>
      </KeyboardAvoidingView>
      <View
        style={{
          height: 160,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 28,
        }}
      >
        <Button
          mode="text"
          style={{ width: 220 }}
          onPress={() => {
            router.replace("/auth/register");
          }}
        >
          {t("I don't have an account", { ns: "acc" })}
        </Button>
        <Button
          mode="contained"
          style={{ width: 150 }}
          loading={logining}
          disabled={logining}
          onPress={() => {
            loginUser();
          }}
        >
          {t("Log in", { ns: "acc" })}
        </Button>
      </View>
    </SafeAreaView>
  );
}
