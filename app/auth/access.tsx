import * as React from "react";
import { Pressable, View } from "react-native";
import { Card, RadioButton, Text, useTheme, Button } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import GroupAddIcon from "../../assets/images/icons/group_add.svg";
import { useTranslation } from "react-i18next";

const accessOptions = [
  {
    id: "create-account",
    name: "Create an account",
    desc: "Sign in",
  },
  {
    id: "continue-without-account",
    name: "Continue without an account",
    desc: "Go to home page",
  },
  {
    id: "already-have-account",
    name: "Already have an account",
    desc: "Sign in",
  },
];

export default function AccessPage() {
  const { t } = useTranslation();
  const theme = useTheme();
  const [accessOption, setAccessOption] = React.useState("create-account");
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
        <Pressable onPress={() => router.replace("/common/language")}>
          <ArrowBackIcon
            fill={theme.colors.onPrimaryContainer}
            width={34}
            height={34}
          />
        </Pressable>
        <GroupAddIcon
          fill={theme.colors.onPrimaryContainer}
          width={64}
          height={64}
        />
      </View>
      <Text
        variant="titleLarge"
        style={{ marginTop: 38, color: theme.colors.onSurfaceVariant }}
      >
        {t("Just one more step", { ns: "acc" })}
      </Text>
      <Text
        variant="headlineLarge"
        style={{ marginTop: 16, color: theme.colors.onPrimaryContainer }}
      >
        {t("Do you want to create an account", { ns: "acc" })}
      </Text>
      <View style={{ flex: 1, justifyContent: "center", gap: 16 }}>
      {accessOptions.map((option) => (
        <Card
          key={option.id}
          mode={option.id === accessOption ? "elevated" : "contained"}
          onPress={() => setAccessOption(option.id)}
          style={{
            backgroundColor:
              accessOption === option.id
                ? theme.colors.surface
                : theme.colors.background,
            borderRadius: 12,
            width: "100%",
            height: 80,
            flexDirection: "row",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
              width: "100%"
            }}
          >
            <View
              style={{
                flexDirection: "column",
                justifyContent: "center",
                paddingStart: 18,
              }}
            >
              <Text variant="bodyLarge" style={{ fontWeight: "900" }}>
                {t(option.name, { ns: "acc" })}
              </Text>
              <Text variant="bodyMedium">{t(option.desc, { ns: "acc" })}</Text>
            </View>
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                width: 80,
                height: 80,
              }}
            >
              <RadioButton
                value={option.id}
                onPress={() => {
                  setAccessOption(option.id);
                }}
                status={option.id === accessOption ? "checked" : "unchecked"}
              />
            </View>
          </View>
        </Card>
      ))}
      </View>
      <View style={{ height: 120, justifyContent: "flex-start", alignItems: "center" }}>
        <Button mode="contained" style={{width:150}} onPress={() => {
          switch(accessOption) {
            case "create-account":
              router.replace("/auth/register");
              break;
            case "continue-without-account":
              router.replace("/(tabs)");
              break;
            case "already-have-account":
              router.replace("/auth/login");
              break;
          }
        }}>
          {t("comm:Done")}
        </Button>
      </View>
    </View>
  );
}
