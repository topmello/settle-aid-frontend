import React, { useMemo } from "react";
import { View, TouchableOpacity, FlatList, ScrollView } from "react-native";
import {
  Text,
  Card,
  List,
  Button,
  useTheme,
  Surface,
  IconButton,
} from "react-native-paper";
import { useTranslation } from "react-i18next";

import { RouteState } from "../store/routeSlice";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Tip } from "../tips/tipsTyped";
import { router } from "expo-router";

import { RouteResult } from "../types/route";
import BottomSheet, {
  BottomSheetFlatList,
  BottomSheetScrollView,
} from "@gorhom/bottom-sheet";

type OverlayProps = {
  tipList: Tip[];
  data: RouteResult;
  body: RouteState;
  handleLocationSelect: (location: any) => void;
  handlePressRoute: (index: number) => void;
  handlePress: (index: number) => void;
  checked: boolean[];
  styles: any;
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
  styles,
  locationIcons,
}) => {
  const theme = useTheme();
  const { t } = useTranslation();

  const bottomSheetRef = React.useRef<BottomSheet>(null);
  const snapPoints = useMemo(() => ["15%", "50%", "100%"], []);

  return (
    <View
      pointerEvents="box-none"
      style={{
        flex: 1,
      }}
    >
      <BottomSheet
        ref={bottomSheetRef}
        index={1}
        snapPoints={snapPoints}
        style={{
          zIndex: 1,
          elevation: 5,
        }}
        animateOnMount={true}
        backgroundStyle={{
          backgroundColor: theme.colors.surface,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.onSurfaceVariant,
        }}
      >
        <BottomSheetScrollView
          style={{
            flex: 1,
          }}
        >
          <View
            style={{
              height: 138,
              width: "100%",
            }}
          >
            <BottomSheetFlatList
              data={tipList}
              renderItem={({ item }) => (
                <Surface
                  style={{
                    backgroundColor: theme.colors.primaryContainer,
                    borderRadius: 8,
                    width: 300,
                    marginVertical: 4,
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
                    <IconButton icon="chevron-right" onPress={() => {}} />
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
          </View>
          <List.Section>
            {data?.locations.map((location: string, index: number) => {
              const description = body?.location_type[index];
              const capitalizedDescription =
                description.charAt(0).toUpperCase() + description.slice(1);

              const Icon = locationIcons[body?.location_type[index]];
              return (
                <List.Item
                  key={index}
                  title={location}
                  description={capitalizedDescription}
                  left={(props) => (
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
          <List.Section>
            <List.Accordion
              title="Instructions"
              left={(props) => <List.Icon {...props} icon="map-legend" />}
            >
              {data?.instructions.map((instruction: string, index: number) => {
                return (
                  <List.Item
                    key={index}
                    title={instruction}
                    onPress={() => handlePressRoute(index)}
                    left={(props) => (
                      <TouchableOpacity
                        key={index}
                        onPress={() => handlePress(index)}
                        style={{
                          backgroundColor: "transparent",
                          paddingLeft: 20,
                        }}
                      >
                        <List.Icon
                          icon={
                            checked[index] ? "check" : "checkbox-blank-outline"
                          }
                        />
                      </TouchableOpacity>
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
        </BottomSheetScrollView>
      </BottomSheet>
    </View>
  );
};

export default ResultOverlay;
