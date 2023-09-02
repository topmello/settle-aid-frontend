import React from "react";
import { View, TouchableOpacity, FlatList, ScrollView } from "react-native";
import { Text, Card, List, Button, useTheme } from "react-native-paper";
import { useTranslation } from "react-i18next";

import { RouteState } from "../store/routeSlice";

import FontAwesome from "@expo/vector-icons/FontAwesome";

import { Tip } from "../tips/tipsTyped";
import { router } from "expo-router";

import { RouteResult } from "../types/route";

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

  return (
    <View>
      <Card style={[styles.card]}>
        <FlatList
          data={tipList}
          renderItem={({ item }) => (
            <Card
              style={[
                styles.flatListCard,
                { backgroundColor: theme.colors.primaryContainer },
              ]}
            >
              <Card.Title
                title={`${item.description}`}
                subtitle={`${item.content}`}
                right={() => (
                  <TouchableOpacity
                    onPress={() => {
                      router.replace("/learn");
                    }}
                  >
                    <Text>{t("comm:Learn")}</Text>
                  </TouchableOpacity>
                )}
              />
            </Card>
          )}
          keyExtractor={(tip) => tip?.description}
          contentContainerStyle={{
            columnGap: 10,
            margin: 14,
            marginBottom: 30,
          }}
          horizontal={true}
        />
        <ScrollView>
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
                        backgroundColor: "#000",
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
                        size={32}
                        color="white"
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
        </ScrollView>
      </Card>
    </View>
  );
};

export default ResultOverlay;
