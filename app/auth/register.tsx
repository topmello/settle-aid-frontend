import * as React from "react";
import {
  Pressable,
  View,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
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
import PersonAddIcon from "../../assets/images/icons/person_add.svg";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useTranslation } from "react-i18next";
import { fetch } from "../../api/fetch";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch } from "../../store";
import { loginUser as loginUserThunk } from "../../store/authSlice";
import { registerUser as registerUserThunk } from "../../store/authSlice";
import { useNotification } from "../../hooks/useNotification"


// for default route to home screen
export const unstable_settings = {
  initialRouteName: "index",
};

export default function RegisterPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [username, setUsername] = React.useState("");
  const [usernameError, setUsernameError] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [showPassword, setShowPassword] = React.useState(false);
  const [passwordError, setPasswordError] = React.useState("");
  const [generatedUsername, setGeneratedUsername] = React.useState("");
  const [generating, setGenerating] = React.useState(false);
  const [registering, setRegistering] = React.useState(false);

  const { pushNotification } = useNotification();

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
    } catch (error) {
      console.log("Failed to generate username ", error);
    }
    setGenerating(false);
  }, []);

  const getGenUsername = React.useCallback(
    (isRegenerate: boolean = false) => {
      generateUsername();
      if (username === "" || isRegenerate) {
        setUsername(generatedUsername);
      }
    },
    [generateUsername, generatedUsername, username]
  );

  React.useEffect(() => {
    getGenUsername();
  }, []);

  const registerUser = React.useCallback(() => {
    setRegistering(true);
    return dispatch(registerUserThunk({ username, password }))
      .unwrap()
      .then(() => {
        pushNotification({
          message: t("Sign up successful", { ns: "acc" }),
          type: "success",
        });
        return true;
      })
      .catch((err) => {
        pushNotification({
          message: t("Sign up failed", { ns: "acc" }) + ": " + err.message,
          type: "error",
        });
        setRegistering(false);
        return false;
      });
  }, [username, password]);

  const loginUser = React.useCallback(() => {
    dispatch(loginUserThunk({ username, password }))
      .unwrap()
      .then(() => {
        setRegistering(false);
        router.replace("/(tabs)");
      })
      .catch((err) => {
        setRegistering(false);
        pushNotification({
          message: t("Sign in failed", { ns: "acc" }),
          type: "error",
        });
      });
  }, [username, password]);

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
        {router.canGoBack() ? (
          <Pressable onPress={() => router.back()}>
            <ArrowBackIcon
              fill={theme.colors.onPrimaryContainer}
              width={34}
              height={34}
            />
          </Pressable>
        ) : (
          <View></View>
        )}
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
            autoComplete="username"
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
            autoComplete="password"
            theme={{
              colors: {
                background: theme.colors.primaryContainer,
              },
            }}
            error={!!passwordError}
            mode="outlined"
            label={t("Password", { ns: "acc" })}
            style={{ backgroundColor: "transparent", height: 56 }}
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
          height: 190,
          justifyContent: "flex-start",
          alignItems: "center",
          gap: 16,
        }}
      >
        <Button
          mode="outlined"
          onPress={() => {
            getGenUsername(true);
          }}
          loading={generating}
        >
          {t("Generate a username", { ns: "acc" })}
        </Button>
        <Button
          mode="text"
          style={{ margin: 0 }}
          onPress={() => {
            router.replace("/auth/login");
          }}
        >
          {t("Already have an account", { ns: "acc" })}
        </Button>
        <Button
          mode="contained"
          style={{ width: 150 }}
          onPress={async () => {
            if (validateUsername(username) && validatePassword(password)) {
              if (await registerUser()) {
                loginUser();
              }
            }
          }}
          loading={registering}
        >
          {t("comm:Done")}
        </Button>
      </View>
    </SafeAreaView>
  );
}
