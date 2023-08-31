import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ScrollView,
} from "react-native";
import { Card, List, Button } from "react-native-paper";

import { RouteState } from "../store/routeSlice";

import FontAwesome from "@expo/vector-icons/FontAwesome";

interface RouteResult {
  locations: string[];
  locations_coordinates: {
    latitude: number;
    longitude: number;
  }[];
  route: {
    latitude: number;
    longitude: number;
  }[];
  instructions: string[];
  duration: number;
}

type OverlayProps = {
  data: RouteResult;
  body: RouteState;
  handleTriggerFetch: () => void;
  handleLocationSelect: (location: any) => void;
  handlePressRoute: (index: number) => void;
  handlePress: (index: number) => void;
  checked: boolean[];
  styles: any;
  location_type_icon: any;
};

const ResultOverlay: React.FC<OverlayProps> = ({
  data,
  body,
  handleTriggerFetch,
  handleLocationSelect,
  handlePressRoute,
  handlePress,
  checked,
  styles,
  location_type_icon,
}) => {
  return (
    <View>
      <Card style={styles.card}>
        <FlatList
          data={[1, 2, 3]}
          renderItem={({ item }) => (
            <Card style={styles.flatListCard}>
              <Card.Title
                title={`Tips ${item}`}
                subtitle="Subtitle"
                right={() => (
                  <TouchableOpacity>
                    <Text>Learn</Text>
                  </TouchableOpacity>
                )}
              />
            </Card>
          )}
          keyExtractor={(item) => item?.toString()}
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
              var LocationType: string =
                body?.location_type[index].charAt(0).toUpperCase() +
                body?.location_type[index].slice(1);
              return (
                <List.Item
                  key={location}
                  title={location}
                  description={LocationType}
                  left={(props) => (
                    <List.Icon
                      {...props}
                      icon={
                        location_type_icon[body?.location_type[index]] ||
                        "folder"
                      }
                    />
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
          >
            <Button mode="contained" style={styles.button}>
              Back
            </Button>
            <Button
              mode="contained"
              style={styles.button}
              onPress={handleTriggerFetch}
            >
              Reroute
            </Button>
          </View>
        </ScrollView>
      </Card>
    </View>
  );
};

export default ResultOverlay;
