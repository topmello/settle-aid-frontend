import React, { useEffect, useMemo } from "react";
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
import FontAwesome from "@expo/vector-icons/FontAwesome";
import { Tip } from "../tips/tipsTyped";
import { Route } from "../types/route";
import { useTip } from "../store/TipContext";
import { router } from "expo-router";
import Animated from "react-native-reanimated";
import { useTranslation } from "react-i18next";

type OverlayProps = {
  tipList?: Tip[];
  data: Route;
  handleLocationSelect: (location: any) => void;
  handlePressRoute: (index: number) => void;
  handlePress: (index: number) => void;
  handleHide: (isHide: boolean) => void;
  checked: boolean[];
  locationIcons: any;
};

const ResultOverlay: React.FC<OverlayProps> = ({
  tipList,
  data,
  handleLocationSelect,
  handlePressRoute,
  handlePress,
  checked,
  locationIcons,
  handleHide,
}: OverlayProps) => {
  const theme = useTheme();
  const bottomSheetRef = React.useRef<Animated.View>(null);
  const { setCategory, setCurrentTipIndex } = useTip();
  const [showBottomSheet, setShowBottomSheet] = React.useState(true);
  const { t } = useTranslation();

  return (
    <Animated.View
      ref={bottomSheetRef}
      style={[
        {
          elevation: 5,
          position: "absolute",
          height: 420,
          zIndex: 1,
          bottom: showBottomSheet ? 0 : -280,
          borderTopLeftRadius: 16,
          borderTopRightRadius: 16,
          width: "100%",
          backgroundColor: theme.colors.surface,
        },
      ]}
    >
      <IconButton
        mode="contained"
        iconColor={theme.colors.onPrimaryContainer}
        containerColor={theme.colors.primaryContainer}
        icon={!showBottomSheet ? "chevron-up" : "chevron-down"}
        style={{
          position: "absolute",
          top: -24,
          right: 16,
          zIndex: 2,
        }}
        onPress={() => {
          setShowBottomSheet(!showBottomSheet);
          handleHide(!showBottomSheet);
        }}
      />
      <ScrollView>
        {/** Horizontal Tips */}
        {tipList && (
          <FlatList
            style={{
              width: "100%",
            }}
            data={tipList}
            renderItem={({ item, index }) => (
              <Surface
                style={{
                  backgroundColor: theme.colors.primaryContainer,
                  borderRadius: 8,
                  width: 300,
                  marginTop: 12,
                  marginBottom: 8,
                  flexDirection: "row",
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    flexDirection: "row",
                    padding: 16,
                  }}
                  onPress={() => {
                    setCategory({
                      mode: "tip",
                      type: tipList,
                    });
                    setCurrentTipIndex(index);
                    router.push("/learn/detail");
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
                        setCategory({
                          mode: "tip",
                          type: tipList,
                        });
                        router.push("/learn/detail");
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </Surface>
            )}
            keyExtractor={(tip) => tip?.description}
            contentContainerStyle={{
              columnGap: 10,
              margin: 14,
            }}
            horizontal={true}
          />
        )}

        {/** Destinations */}
        <List.Section>
          {data &&
            data.locations.map((location: string, index: number) => {
              const locationType = data?.location_type;
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

              return (
                <List.Item
                  key={index}
                  title={location}
                  description={t(capitalizedDescription, { ns: "route" })}
                  left={() => (
                    <View style={{ justifyContent: "center", paddingLeft: 10 }}>
                      {Icon ? (
                        <Icon width={30} height={30} />
                      ) : (
                        <View
                          style={{
                            width: 30,
                            height: 30,
                            borderRadius: 15,
                            backgroundColor: "grey",
                          }}
                        ></View>
                      )}
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
        <List.Section
          style={{
            paddingHorizontal: 12,
          }}
        >
          <List.Accordion
            title={t("Instructions", { ns: "route" })}
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
    </Animated.View>
  );
};

export default ResultOverlay;
