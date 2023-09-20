import * as React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import {
  Text,
  useTheme,
  Button,
  List,
  Divider,
  Chip,
  TextInput,
} from "react-native-paper";
import { router } from "expo-router";
import ArrowBackIcon from "../../assets/images/icons/arrow_back.svg";
import { useTranslation } from "react-i18next";
import { SafeAreaView } from "react-native-safe-area-context";
import ShoppingCartIcon from "../../assets/images/icons/shopping_cart.svg";
import FastfoodIcon from "../../assets/images/icons/fastfood.svg";
import ParkBirdsIcon from "../../assets/images/icons/park_birds.svg";
import PharmacyIcon from "../../assets/images/icons/pharmacy.svg";
import { useDispatch, useSelector } from "react-redux";
import {
  LocationType,
  selectLocationType,
  setQueryWithLocationType,
} from "../../store/routeSlice";
import { ActivityOption } from "./activity";
import { useAppTheme } from "../../theme/theme";
import { useNotification } from "../../hooks/useNotification";

type ActivityPrompt = {
  id: LocationType;
  name: string;
  logo: any;
  positivePrompts: string[];
  negativePrompts: string[];
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
  const theme = useAppTheme();
  const [activityPrompts, setActivityPrompts] = React.useState<
    ActivityPrompt[]
  >([]);
  const dispatch = useDispatch();
  const activities = useSelector(selectLocationType);

  const { pushNotification } = useNotification();

  const [tempPositivePrompt, setTempPositivePrompt] = React.useState("");
  const [tempNegativePrompt, setTempNegativePrompt] = React.useState("");
  const [selectedActivity, setSelectedActivity] =
    React.useState<ActivityPrompt | null>(null);

  React.useEffect(() => {
    setActivityPrompts([
      ...activities.map((activity) => {
        switch (activity) {
          case "grocery":
            return {
              ...activityOptions[0],
              positivePrompts: ["fresh"],
              negativePrompts: ["crowded"],
            };
          case "restaurant":
            return {
              ...activityOptions[1],
              positivePrompts: ["tasty"],
              negativePrompts: ["dirty"],
            };
          case "landmark":
            return {
              ...activityOptions[2],
              positivePrompts: ["scenic"],
              negativePrompts: ["packed"],
            };
          case "pharmacy":
            return {
              ...activityOptions[3],
              positivePrompts: ["professional"],
              negativePrompts: ["fake"],
            };
        }
      }),
    ]);
  }, [activities]);

  React.useEffect(() => {
    if (activityPrompts.length > 0) {
      setSelectedActivity(activityPrompts[0]);
    }
  }, [activityPrompts]);

  const addPromptToActivity = React.useCallback(
    (id: LocationType, prompt: string, isPositive: boolean = true) => {
      const activity = activityPrompts.find((activity) => activity.id === id);
      if (activity) {
        if (isPositive) {
          if (activity.positivePrompts.includes(prompt)) {
            pushNotification({
              message: `You have already added ${prompt} to ${activity.name}`,
              type: "warning",
            });
            return;
          }
          activity.positivePrompts.push(prompt);
        } else {
          if (activity.negativePrompts.includes(prompt)) {
            pushNotification({
              message: `You have already added ${prompt} to ${activity.name}`,
              type: "warning",
            });
            return;
          }
          activity.negativePrompts.push(prompt);
        }
      } else {
        console.error("Activity not found for prompt: ", prompt);
      }
    },
    [activityPrompts]
  );

  const removePromptFromActivity = React.useCallback(
    (id: LocationType, prompt: string, isPositive: boolean = true) => {
      const activity = activityPrompts.find((activity) => activity.id === id);
      if (activity) {
        if (isPositive) {
          activity.positivePrompts = activity.positivePrompts.filter(
            (p) => p !== prompt
          );
        } else {
          activity.negativePrompts = activity.negativePrompts.filter(
            (p) => p !== prompt
          );
        }
        pushNotification({
          message: `Removed ${prompt} from ${activity.name}`,
          type: "success",
          action: {
            label: "Undo",
            onPress: () => {
              addPromptToActivity(id, prompt, isPositive);
            },
          }
        })
      } else {
        console.error("Activity not found for prompt: ", prompt);
      }
    },
    [activityPrompts]
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
          marginTop: 16,
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
        <Text variant="headlineMedium" style={{ marginTop: 12 }}>
          {t("Second", { ns: "route" })}
        </Text>
        <Text
          variant="headlineMedium"
          style={{ color: theme.colors.onPrimaryContainer, fontWeight: "bold" }}
        >
          {t("Tell us more about your preferences", { ns: "route" })}
        </Text>
      </View>
      <View style={{
        flex: 1,
        justifyContent: "center",
      }}>
        <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{
          paddingTop: 18,
          paddingBottom: 8,
          justifyContent: "center",
        }}
      >
        <ScrollView
          contentContainerStyle={{
            paddingBottom: 20,
            justifyContent: "center",
            gap: 8
          }}
        >
          {activityPrompts.map((activity) => (
            <List.Accordion
              key={activity.id}
              style={{ width: "100%", paddingVertical: 0 }}
              title={t(activity.name, { ns: "route" })}
              titleStyle={{
                color: theme.colors.onPrimaryContainer,
                fontWeight: "bold",
              }}
              description={activity.positivePrompts
                .map((val) => `#${val}`)
                .join(" ")}
              onPress={() => {
                setSelectedActivity(activity);
              }}
              expanded={selectedActivity?.id === activity.id}
              left={(props) =>
                React.createElement(activity.logo, {
                  width: 32,
                  height: 32,
                  marginLeft: 10,
                  ...props,
                })
              }
            >
              <View
                style={{
                  paddingLeft: 0,
                  paddingBottom: 8,
                  width: "100%",
                  backgroundColor: theme.colors.surface,
                }}
              >
                <Divider />
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingTop: 8,
                    paddingBottom: 4,
                    flexDirection: "row",
                    flexWrap: "wrap",
                  }}
                >
                  {activity.positivePrompts.map((prompt) => (
                    <Chip
                      icon="heart-outline"
                      mode="outlined"
                      selectedColor={theme.colors.primary}
                      onClose={() => {
                        removePromptFromActivity(activity.id, prompt);
                      }}
                      style={{ margin: 4 }}
                      key={prompt}
                    >
                      {prompt}
                    </Chip>
                  ))}
                  {activity.negativePrompts.map((prompt) => (
                    <Chip
                      icon="cancel"
                      mode="outlined"
                      selectedColor={theme.colors.error}
                      theme={{
                        colors: {
                          primary: theme.colors.error,
                        },
                      }}
                      onClose={() => {
                        removePromptFromActivity(activity.id, prompt, false);
                      }}
                      style={{ margin: 4 }}
                      key={prompt}
                    >
                      {prompt}
                    </Chip>
                  ))}
                </View>
                <View style={style.promptRow}>
                  <TextInput
                    style={style.promptInput}
                    outlineStyle={{
                      ...style.promptInputOutline,
                      borderColor: theme.colors.primary,
                    }}
                    left={<TextInput.Icon
                      icon="heart-outline"
                    />}
                    mode="outlined"
                    placeholder={t("Add things you love", { ns: "route" })}
                    value={tempPositivePrompt}
                    onChangeText={setTempPositivePrompt}
                    dense
                  />
                  <Button
                    buttonColor={theme.colors.primaryContainer}
                    textColor={theme.colors.onPrimaryContainer}
                    onPress={() => {
                      if (tempPositivePrompt.length > 0) {
                        addPromptToActivity(activity.id, tempPositivePrompt);
                        setTempPositivePrompt("");
                      } else {
                        pushNotification({
                          message: t("Please enter a prompt", { ns: "route" }),
                          type: "error",
                        })
                      }
                    }}
                  >
                    {t("Love", { ns: "route" })}
                  </Button>
                </View>
                <View style={style.promptRow}>
                  <TextInput
                    style={style.promptInput}
                    outlineStyle={{
                      ...style.promptInputOutline,
                      borderColor: theme.colors.error,
                    }}
                    left={<TextInput.Icon
                      icon="cancel"
                    />}
                    mode="outlined"
                    placeholder={t("Add things to avoid", { ns: "route"})}
                    value={tempNegativePrompt}
                    onChangeText={setTempNegativePrompt}
                    dense
                  />
                  <Button
                    buttonColor={theme.colors.errorContainer}
                    textColor={theme.colors.onErrorContainer}
                    onPress={() => {
                      if (tempNegativePrompt.length > 0) {
                        addPromptToActivity(
                          activity.id,
                          tempNegativePrompt,
                          false
                        );
                        setTempNegativePrompt("");
                      } else {
                        pushNotification({
                          message: t("Please enter a prompt", { ns: "route" }),
                          type: "error",
                        })
                      }
                    }}
                  >
                    {t("Avoid", { ns: "route" })}
                  </Button>
                </View>
              </View>
            </List.Accordion>
          ))}
        </ScrollView>
      </KeyboardAvoidingView>
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
            dispatch(
              setQueryWithLocationType({
                location_type: activityPrompts.map((activity) => activity.id),
                query: activityPrompts.map((activity) =>
                  activity.positivePrompts.join(",") || ""
                ),
                negative_query: activityPrompts.map((activity) =>
                  activity.negativePrompts.join(",") || ""
                ),
              })
            );
            router.push("/route/location");
          }}
        >
          {t("comm:Next")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const style = StyleSheet.create({
  promptRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingBottom: 8,
    gap: 12,
  },
  promptInput: {
    flex: 1,
  },
  promptInputOutline: {
    borderRadius: 20,
  },
});
