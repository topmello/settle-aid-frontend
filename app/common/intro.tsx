import { View, Image, ImageBackground, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAppTheme } from "../../theme/theme";
import { Text, Button } from "react-native-paper";
import { router } from "expo-router";
import { useTranslation } from "react-i18next";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";

export default function IntroScreen() {
  const theme = useAppTheme();
  const { t } = useTranslation();
  return (
    <ImageBackground
      source={require("../../assets/images/cta_background.jpg")}
      style={{ flex: 1, justifyContent: "center" }}
    >
      <View
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: "100%",
          width: "100%",
          backgroundColor: theme.colors.primaryContainer,
          opacity: 0.9,
        }}
      ></View>
      <SafeAreaView
        style={{
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
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowBackIcon
                fill={theme.colors.onPrimaryContainer}
                width={34}
                height={34}
              />
            </TouchableOpacity>
          ) : (
            <View></View>
          )}
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          <Image
            source={require("../../assets/images/icon.png")}
            style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              marginTop: 38,
            }}
          />
          <Text
            variant="displayMedium"
            style={{ marginTop: 34, color: theme.colors.onPrimaryContainer }}
          >
            {t("Settle Aid", {
              lng: "en-AU",
              ns: "trans",
            })}
          </Text>
          <Text
            variant="headlineMedium"
            style={{ marginTop: 18, color: theme.colors.onPrimaryContainer }}
          >
            {t("Your Ultimate Travel Companion", {
              ns: "trans",
            })}
          </Text>
          <Text
            variant="headlineSmall"
            style={{ marginTop: 18, color: theme.colors.primary }}
          >
            {t("Immerse yourself", {
              ns: "trans",
            })}
          </Text>
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
    </ImageBackground>
  );
}
