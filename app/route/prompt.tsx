import * as React from "react";
import { Pressable, View } from "react-native";
import { Card, RadioButton, Text, useTheme, Button, List } from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import GroupAddIcon from "../../assets/images/icons/group_add.svg";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ShoppingCartIcon from "../../assets/images/icons/shopping_cart.svg";
import FastfoodIcon from "../../assets/images/icons/fastfood.svg";
import ParkBirdsIcon from "../../assets/images/icons/park_birds.svg";
import MountainTreesIcon from "../../assets/images/icons/mountain_trees.svg";
import PharmacyIcon from "../../assets/images/icons/pharmacy.svg";
import { useDispatch, useSelector } from "react-redux";
import { LocationType, selectLocationType, setLocationType } from "../../store/routeSlice";
import { ActivityOption } from "./activity";

type ActivityPrompt = {
  id: LocationType;
  name: string;
  logo: any;
  prompt: string[];
}

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
  const [activityPrompts, setActivityPrompts] = React.useState<
    ActivityPrompt[]
  >([]);
  const dispatch = useDispatch();
  const activities = useSelector(selectLocationType);

  React.useEffect(() => {
    setActivityPrompts([...activities.map((activity) => {
      switch (activity) {
        case "grocery":
          return {
            ...activityOptions[0],
            prompt: []
          }
        case "restaurant":
          return {
            ...activityOptions[1],
            prompt: []
          }
        case "landmark":
          return {
            ...activityOptions[2],
            prompt: []
          }
        case "pharmacy":
          return {
            ...activityOptions[3],
            prompt: []
          }
      }
    })]);
  }, [activities]);

  const addPromptToActivity = React.useCallback(
    (id: LocationType, prompt: string) => {
      const activity = activityPrompts.find((activity) => activity.id === id);
      if (activity) {
        activity.prompt.push(prompt);
      } else {
        console.error("Activity not found for prompt: ", prompt);
      }
    }, [activityPrompts]
  );

  const removePromptFromActivity = React.useCallback(
    (id: LocationType, prompt: string) => {
      const activity = activityPrompts.find((activity) => activity.id === id);
      if (activity) {
        activity.prompt = activity.prompt.filter((p) => p !== prompt);
      } else {
        console.error("Activity not found for prompt: ", prompt);
      }
    }, [activityPrompts]
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
            2
          </Text>
          <Text variant="headlineMedium">/3</Text>
        </View>
      </View>
      <View style={{ paddingStart: 8 }}>
        <Text variant="headlineMedium" style={{ marginTop: 38 }}>
          {t("Second", { ns: "route" })}
        </Text>
        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onPrimaryContainer }}
        >
          {t("Tell us more about your preferences", { ns: "route" })}
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
          {activityPrompts.map((activity) => (
            <List.Accordion
              title="Uncontrolled Accordion"
              left={props => <List.Icon {...props} icon="folder" />}>
              <List.Item title="First item" />
              <List.Item title="Second item" />
            </List.Accordion>
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
            dispatch(
              setLocationType(selectedOptions.map((option) => option.id))
            );
          }}
        >
          {t("comm:Done")}
        </Button>
      </View>
    </SafeAreaView>
  );
}
