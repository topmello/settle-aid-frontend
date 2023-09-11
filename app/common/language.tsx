import React, { useCallback, useEffect } from "react";
import { View } from "react-native";
import { Card, RadioButton, Text, useTheme, Button } from "react-native-paper";
import TranslateIcon from "../../assets/images/icons/translate.svg";
import AustraliaFlagIcon from "../../assets/images/flags/australia-flag.svg";
import ChinaFlagIcon from "../../assets/images/flags/china-flag.svg";
import IndiaFlagIcon from "../../assets/images/flags/india-flag.svg";
import { useTranslation } from "react-i18next";
import { selectLanguage, setLanguage } from "../../store/appSlice";
import { useDispatch, useSelector } from "react-redux";
import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppDispatch } from "../../store";
import { LanguageCode } from "../../translation";

type Language = {
  name: string;
  code: LanguageCode,
  desc: string;
  icon: JSX.Element;
};

const languages:Language[] = [
  {
    name: "English",
    code: "en-AU",
    desc: "English (Australia)",
    icon: <AustraliaFlagIcon height={110} width={110} />,
  },
  {
    name: "हिन्दी (भारत)",
    code: "hi-IN",
    desc: "Hindi",
    icon: <IndiaFlagIcon height={110} width={110} />,
  },
  {
    name: "中文 (中国)",
    code: "zh-CN",
    desc: "Chinese (Simplified)",
    icon: <ChinaFlagIcon height={110} width={110} />,
  },
];

export default function LanguageScreen() {
  const theme = useTheme();
  const { t, i18n } = useTranslation();

  const appLanguage = useSelector(selectLanguage);

  const dispatch = useDispatch<AppDispatch>();

  const changeLanguage = useCallback((language: "en-AU" | "hi-IN" | "zh-CN") => {
    dispatch(setLanguage({ language }));
    i18n.changeLanguage(language);
  }, []);

  return (
    <SafeAreaView
      style={{
        backgroundColor: theme.colors.primaryContainer,
        flex: 1,
        flexDirection: "column",
        padding: 20,
      }}
    >
      <TranslateIcon
        width={64}
        height={64}
        fill={theme.colors.onPrimaryContainer}
        style={{
          marginTop: 16,
        }}
      />
      <Text variant="headlineLarge" style={{ marginTop: 34 }}>
        {t("Choose your language", { lng: "en-AU", ns: "trans" })}
      </Text>
      <Text variant="headlineMedium" style={{ marginTop: 8 }}>
        {t("Choose your language", { lng: "hi-IN", ns: "trans" })}
      </Text>
      <Text variant="headlineSmall" style={{ marginTop: 4 }}>
        {t("Choose your language", { lng: "zh-CN", ns: "trans" })}
      </Text>
      <View style={{ flex: 1, justifyContent: "center", gap: 16 }}>
        {languages.map((language, index) => (
          <Card
            mode={language.code === appLanguage ? "elevated" : "contained"}
            key={index}
            onPressIn={() => {
              changeLanguage(language.code);
            }}
            style={{
              backgroundColor:
                language.code === appLanguage
                  ? theme.colors.surface
                  : theme.colors.background,
              borderRadius: 12,
              width: "100%",
              height: 80,
            }}
          >
            <View style={{ flex: 1, flexDirection: "row" }}>
              <View
                style={{
                  height: 80,
                  width: 110,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                {React.cloneElement(language.icon)}
              </View>
              <View
                style={{
                  height: 80,
                  flex: 1,
                  paddingLeft: 16,
                  justifyContent: "center",
                }}
              >
                <Text variant="bodyLarge" style={{ fontWeight: "900" }}>
                  {language.name}
                </Text>
                <Text variant="bodyMedium">{language.desc}</Text>
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
                  value={language.code}
                  onPress={() => {
                    changeLanguage(language.code);
                  }}
                  status={
                    language.code === appLanguage ? "checked" : "unchecked"
                  }
                />
              </View>
            </View>
          </Card>
        ))}
      </View>
      <View
        style={{
          height: 100,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          mode="contained"
          style={{ width: 150 }}
          onPress={() => {
            router.push("/auth/access");
          }}
        >
          {t("comm:Next")}
        </Button>
      </View>
    </SafeAreaView>
  );
}
