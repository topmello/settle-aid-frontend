import React, { useMemo } from "react";
import { View, TouchableOpacity } from "react-native";
import {
  ScrollView,
  FlatList,
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import {
  Text,
  List,
  useTheme,
  Surface,
  IconButton,
  Checkbox,
} from "react-native-paper";
import { RouteState } from "../store/routeSlice";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tip } from "../tips/tipsTyped";
import { Route } from "../types/route";
import BottomSheet from "@gorhom/bottom-sheet";
import { useTip } from "../store/TipContext";
import { router } from "expo-router";

type OverlayProps = {
  tipList: Tip[];
  data: Route;
  body: RouteState;
  handleLocationSelect: (location: any) => void;
  handlePressRoute: (index: number) => void;
  handlePress: (index: number) => void;
  checked: boolean[];
  locationIcons: any;
};

const ResultOverlay: React.FC<OverlayProps> = ({
  tipList,
  data,
  body,
  handleLocationSelect,
  handlePressRoute,
  handlePress,
  checked,
  locationIcons,
}: OverlayProps) => {
  const theme = useTheme();
  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "50%"], []);
  const { resultTip, setResultTip } = useTip();

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      style={{
        elevation: 5,
        zIndex: 5,
      }}
      animateOnMount={false}
      backgroundStyle={{
        backgroundColor: theme.colors.surface,
      }}
      handleIndicatorStyle={{
        backgroundColor: theme.colors.onSurfaceVariant,
      }}
    >
      <ScrollView>
        {/** Horizontal Tips */}
        <FlatList
          style={{
            width: "100%",
            overflow: "visible",
          }}
          data={tipList}
          renderItem={({ item }) => (
            <Surface
              style={{
                backgroundColor: theme.colors.primaryContainer,
                borderRadius: 8,
                width: 300,
                padding: 16,
                flexDirection: "row",
              }}
            >
              <View
                style={{
                  flex: 1,
                }}
              >
                <Text variant="bodyLarge" style={{ fontWeight: "bold" }}>
                  {item.description}
                </Text>
                <Text
                  variant="bodyMedium"
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
                  {item.content}
                </Text>
              </View>
              <View
                style={{
                  width: 30,
                  height: "100%",
                  justifyContent: "center",
                }}
              >
                <IconButton
                  icon="chevron-right"
                  onPress={() => {
                    setResultTip(item);
                    router.push("/learn/detail");
                  }}
                />
              </View>
            </Surface>
          )}
          keyExtractor={(tip) => tip?.description}
          contentContainerStyle={{
            columnGap: 10,
            margin: 14,
          }}
          horizontal={true}
        />

        {/** Destinations */}
        <List.Section>
          {data &&
            Array.isArray(data.locations) &&
            data.locations.map((location: string, index: number) => {
              const locationType = body?.location_type;
              if (
                !locationType ||
                !Array.isArray(locationType) ||
                typeof location !== "string"
              ) {
                return null;
              }

              const description = locationType[index] || "";
              const capitalizedDescription =
                description.charAt(0).toUpperCase() + description.slice(1);

              const Icon =
                locationIcons &&
                locationType &&
                locationIcons[locationType[index]];
              if (!Icon) {
                return null;
              }
              return (
                <List.Item
                  key={index}
                  title={location}
                  description={capitalizedDescription}
                  left={() => (
                    <View style={{ justifyContent: "center", paddingLeft: 10 }}>
                      <Icon width={30} height={30} />
                    </View>
                  )}
                  right={() => (
                    <TouchableOpacity
                      style={{
                        backgroundColor: theme.colors.primaryContainer,
                        borderRadius: 24,
                        height: 48,
                        width: 48,
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                      onPress={() =>
                        handleLocationSelect(
                          data.locations_coordinates[index + 1]
                        )
                      }
                    >
                      <FontAwesome
                        name="location-arrow"
                        size={30}
                        color={theme.colors.onPrimaryContainer}
                      />
                    </TouchableOpacity>
                  )}
                />
              );
            })}
        </List.Section>

        {/** Instructions */}
        <List.Section>
          <List.Accordion
            title="Instructions"
            left={(props) => <List.Icon {...props} icon="map-legend" />}
          >
            {data &&
              Array.isArray(data.instructions) &&
              data.instructions.map((instruction: string, index: number) => {
                if (typeof instruction !== "string") {
                  return null;
                }

                const isChecked = Array.isArray(checked) && !!checked[index];

                return (
                  <List.Item
                    key={index}
                    title={instruction}
                    onPress={() => handlePressRoute(index)}
                    left={() => (
                      <Checkbox
                        key={index}
                        onPress={() => handlePress(index)}
                        status={isChecked ? "checked" : "unchecked"}
                      />
                    )}
                  />
                );
              })}
          </List.Accordion>
        </List.Section>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            alignItems: "center",
            flex: 1,
            backgroundColor: "transparent",
            padding: 10,
          }}
        ></View>
      </ScrollView>
    </BottomSheet>
  );
};

export default ResultOverlay;
