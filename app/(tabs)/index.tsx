import { StyleSheet, Pressable } from "react-native";
import { Link, Tabs } from "expo-router";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { loginUser } from "../../store/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { selectUserToken } from "../../store/authSlice";
import { selectAuthStatus } from "../../store/authSlice";
import { AppDispatch } from "../../store";
import { Button, Text } from "react-native-paper";

export default function TabOneScreen() {
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const token = useSelector(selectUserToken);
  const authStatus = useSelector(selectAuthStatus);

  return (
    <View style={styles.container}>
      <Text variant="headlineMedium">Tab One</Text>
      <Text>Translation: {t("test:helloWorld")}</Text>
      <Link href="/Location">
        <Button icon="routes" mode="contained">
          Start Planning
        </Button>
      </Link>
      <Text style={styles.title}>Authentication</Text>
      <Text>
        Token here: {token ? token : ""}, Status: {authStatus}
      </Text>
      <Button  mode="contained"
        onPress={() =>
          dispatch(loginUser({ username: "admin", password: "admin" }))
        }
      >
        Retrive Credential
      </Button>
      <Text style={styles.title}>Login Button</Text>
      <Link href={"/common/language"}>
        <Button mode="contained">
          Go Language
        </Button>
      </Link>
      <Link href={"/auth/login"}>
        <Button mode="contained" disabled>
          Go Login
        </Button>
      </Link>
      <Link href={"/auth/register"}>
        <Button mode="contained" disabled>
          Go Register
        </Button>
      </Link>
    </View>
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
