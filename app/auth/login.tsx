import * as React from "react";
import { Pressable, View, KeyboardAvoidingView, Platform } from "react-native";
import { router } from "expo-router";
import {
  Card,
  RadioButton,
  Text,
  useTheme,
  Button,
  TextInput,
  HelperText,
} from "react-native-paper";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import WavingHandIcon from "../../assets/images/icons/waving_hand.svg";
import { useTranslation } from "react-i18next";
import { fetch } from "../../api/fetch";

export default function LoginPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");

  const validateUsername = (text: string) => {
    if (text.length < 3) {
      setUsernameError(t("At least 3 characters", { ns: "acc" }));
      return false;
    } else {
      setUsernameError("");
      return true;
    }
  };

  const validatePassword = (text: string) => {
    if (text.length < 6 && text.match(/^[0-9a-zA-Z]+$/)) {
      setPasswordError(t("At least 6 characters or numbers", { ns: "acc" }));
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };
  return (
    <View
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
        <Pressable onPress={() => router.replace("/auth/access")}>
          <ArrowBackIcon
            fill={theme.colors.onPrimaryContainer}
            width={34}
            height={34}
          />
        </Pressable>
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
            theme={{
              colors: {
                background: theme.colors.primaryContainer,
              },
            }}
            error={!!usernameError}
            mode="outlined"
            label={t("Username", { ns: "acc" })}
            style={{ backgroundColor: "transparent", height: 56 }}
            value={username}
            onChangeText={(text) => {
              validateUsername(text);
              setUsername(text);
            }}
          />
          <HelperText type={usernameError ? "error" : "info"}>
            {usernameError
              ? usernameError
              : ""}
          </HelperText>
        </View>
        <View>
          <TextInput
            theme={{
              colors: {
                background: theme.colors.primaryContainer,
              },
            }}
            error={!!passwordError}
            mode="outlined"
            label={t("Password", { ns: "acc" })}
            style={{ backgroundColor: "transparent", height: 56 }}
            value={password}
            onChangeText={(text) => {
              validatePassword(text);
              setPassword(text);
            }}
          />
          <HelperText type={passwordError ? "error" : "info"}>
            {passwordError
              ? passwordError
              : ""}
          </HelperText>
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
          mode="outlined"
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
          onPress={() => {
            if (validateUsername(username) && validatePassword(password)) {
              router.replace("/(tabs)");
            }
          }}
        >
          {t("Log in", { ns: "acc" })}
        </Button>
      </View>
    </View>
  );
}
