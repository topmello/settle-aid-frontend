import * as React from "react";
import { Pressable, View } from "react-native";
import { Card, RadioButton, Text, useTheme, Button } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ShoppingCartIcon from "../../assets/images/icons/shopping_cart.svg";
import FastfoodIcon from "../../assets/images/icons/fastfood.svg";
import ParkBirdsIcon from "../../assets/images/icons/park_birds.svg";
import PharmacyIcon from "../../assets/images/icons/pharmacy.svg";
import { useDispatch } from "react-redux";
import { LocationType, setLocationType } from "../../store/routeSlice";
import { useNotification } from "../../hooks/useNotification"

export type ActivityOption = {
  id: LocationType;
  name: string;
  logo: any;
};

const activityOptions: ActivityOption[] = [
  {
    id: "grocery",
    name: "Shopping",
    logo: ShoppingCartIcon,
  },
  {
    id: "restaurant",
    name: "Dining",
    logo: FastfoodIcon,
  },
  {
    id: "landmark",
    name: "Travelling",
    logo: ParkBirdsIcon,
  },
  {
    id: "pharmacy",
    name: "Health",
    logo: PharmacyIcon,
  },
];

export default function RouteActivityScreen() {
  const { t } = useTranslation();
  const theme = useTheme();
  const { pushNotification } = useNotification();
  const [selectedOptions, setActivityOptions] = React.useState<
    ActivityOption[]
  >([]);
  const dispatch = useDispatch();

  const optionExists = React.useCallback(
    (selected: ActivityOption) => {
      return selectedOptions.find((option) => option.id === selected.id);
    },
    [selectedOptions]
  );

  const addOrRemoveOption = React.useCallback(
    (option: ActivityOption) => {
      if (optionExists(option)) {
        setActivityOptions(selectedOptions.filter((o) => o.id !== option.id));
      } else {
        setActivityOptions([...selectedOptions, option]);
      }
    },
    [selectedOptions]
  );
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
        <Pressable onPress={() => router.back()}>
          <ArrowBackIcon
            fill={theme.colors.onPrimaryContainer}
            width={34}
            height={34}
          />
        </Pressable>
        <View style={{ flexDirection: "row", paddingEnd: 8 }}>
          <Text variant="headlineMedium" style={{ fontWeight: "900" }}>
            1
          </Text>
          <Text variant="headlineMedium">/3</Text>
        </View>
      </View>
      <View style={{ paddingStart: 8 }}>
        <Text variant="headlineMedium" style={{ marginTop: 38 }}>
          {t("First", { ns: "route" })}
        </Text>
        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onPrimaryContainer }}
        >
          {t("Let us know which", { ns: "route" })}
        </Text>
        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onPrimaryContainer, fontWeight: "900" }}
        >
          {t("activities you want to do", { ns: "route" })}
        </Text>
      </View>
      <View
        style={{
          flex: 1,
          justifyContent: "center",
        }}
      >
        <View
          style={{
            justifyContent: "center",
            marginTop: 32,
            padding: 8,
            gap: 16,
            flexWrap: "wrap",
            flexDirection: "row",
          }}
        >
          {activityOptions.map((option) => (
            <Card
              key={option.id}
              mode={optionExists(option) ? "elevated" : "contained"}
              onPress={() => addOrRemoveOption(option)}
              style={{
                backgroundColor: optionExists(option)
                  ? theme.colors.surface
                  : theme.colors.background,
                borderRadius: 16,
                width: "42%",
                height: 128,
                zIndex: 1,
                elevation: optionExists(option) ? 8 : 0,
                borderWidth: optionExists(option) ? 3 : 0,
                borderColor: theme.colors.primary,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: "100%",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {React.createElement(option.logo, {
                  width: 60,
                  height: 60,
                })}
                <Text variant="bodyLarge" style={{ marginTop: 6 }}>
                  {t(option.name, { ns: "route" })}
                </Text>
              </View>
            </Card>
          ))}
        </View>
      </View>
      <View
        style={{
          height: 120,
          justifyContent: "flex-start",
          alignItems: "center",
        }}
      >
        <Button
          mode="contained"
          style={{ width: 150 }}
          onPress={() => {
            if (selectedOptions.length === 0) {
              pushNotification({
                message: t("Please select at least one activity", {
                  ns: "route",
                }),
                type: "error",
              });
            } else {
              dispatch(
                setLocationType(selectedOptions.map((option) => option.id))
              );
              router.push("/route/prompt");
            }
          }}
        >
          {t("comm:Next")}
        </Button>
      </View>
    </SafeAreaView>
  );
}
