import * as React from "react";
import { Pressable, View, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
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
import PersonAddIcon from "../../assets/images/icons/person_add.svg";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useTranslation } from "react-i18next";
import { fetch } from "../../api/fetch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { loginUser as loginUserThunk } from "../../store/authSlice";

export default function RegisterPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [passwordError, setPasswordError] = React.useState("");
  const [generatedUsername, setGeneratedUsername] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [registering, setRegistering] = React.useState(false);

  const [notification, setNotification] = React.useState("");
  const onDissmissNotification = React.useCallback(() => {
    setNotification("");
  }, []);

  const pushNotification = React.useCallback((message: string) => {
    setNotification(message);
    setTimeout(() => {
      setNotification("");
    }, 3000);
  }, []);

  const selectAuth = useSelector((state: any) => state.auth);
  const dispatch = useDispatch<AppDispatch>();

  const generateUsername = React.useCallback(async () => {
    setGenerating(true);
    try {
      const response = await fetch({
        method: "GET",
        url: "/user/generate",
      });
      if (response.status === 200) {
        setGeneratedUsername(response.data.username);
      }
    } catch(error) {
      console.error("Failed to generate username ", error);
    }
    setGenerating(false);
  }, []);

  const getGenUsername = React.useCallback((isRegenerate: boolean = false) => {
    generateUsername();
    if (username === "" || isRegenerate) {
      setUsername(generatedUsername);
    }
  }, [generateUsername, generatedUsername, username]);

  React.useEffect(() => {
    getGenUsername();
  }, []);

  const registerUser = React.useCallback(async () => {
    setRegistering(true);
    try {
      const response = await fetch({
        method: "POST",
        url: "/user",
        data: {
          username,
          password,
        },
      });
      if (response.status === 200) {
        router.replace("/(tabs)");
        pushNotification(t("Sign up successful", { ns: "acc" }));
      }
    } catch(error) {
      console.error("Failed to register user ", error);
      pushNotification(t("Sign up failed", { ns: "acc" }));
    }
    setRegistering(false);
  }, [username, password]);

  const loginUser = React.useCallback(async () => {
    dispatch(loginUserThunk({ username, password }));
  }, [username, password]);

  React.useEffect(() => {
    if (selectAuth.status === "loginSuccess") {
      router.replace("/(tabs)");
      pushNotification(t("Sign in successful", { ns: "acc" }));
    } else if (selectAuth.status === "loginFailed") {
      pushNotification(t("Sign in failed", { ns: "acc" }));
    }
  }, [selectAuth.status]);

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
    if (text.length < 6 || !text.match(/^[0-9a-zA-Z]+$/)) {
      setPasswordError(t("At least 6 characters or numbers", { ns: "acc" }));
      return false;
    } else {
      setPasswordError("");
      return true;
    }
  };
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
        <Pressable onPress={() => router.replace("/auth/access")}>
          <ArrowBackIcon
            fill={theme.colors.onPrimaryContainer}
            width={34}
            height={34}
          />
        </Pressable>
        <PersonAddIcon
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
        {t("Create an account", { ns: "acc" })}
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
              : t("At least 3 characters", { ns: "acc" })}
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
              : t("At least 6 characters or numbers", { ns: "acc" })}
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
          style={{ width: 260 }}
          onPress={() => {
            getGenUsername(true);
          }}
          loading={generating}
        >
          {t("I don't like this username", { ns: "acc" })}
        </Button>
        <Button
          mode="contained"
          style={{ width: 150 }}
          onPress={async () => {
            if (validateUsername(username) && validatePassword(password)) {
              await registerUser();
              loginUser();
            }
          }}
          loading={registering}
        >
          {t("comm:Done")}
        </Button>
      </View>
      <Snackbar style={{marginLeft: 32}} visible={!!notification} onDismiss={onDissmissNotification}>
        {notification}
      </Snackbar>
    </SafeAreaView>
  );
}
