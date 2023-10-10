import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { Route, RouteHistory } from "../types/route";
import { Button, IconButton, Menu } from "react-native-paper";
import { AnimatedButton } from "./AnimatedButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppTheme } from "../theme/theme";
import { usePrintMap } from "../hooks/usePrintMap";
import useEventScheduler from "../hooks/useEventScheduler";
import { timeSince } from "../utils/time";
import { MaterialCommunityIcons } from "@expo/vector-icons";

interface CardProps {
  routeResult: RouteHistory;
  isSimplified: boolean;
  handleFavRoute?: (route_id: number) => Promise<void>;
  onPressCard?: () => void;
  voted?: boolean;
  index?: number;
  shareUrl?: (route_id: number) => Promise<void>;
  handlePublishRoute?: (route_id: number) => Promise<void>;
}

const getRouteImage = (photo: string) => {
  switch (photo) {
    case "landmarks/Arcade":
      return require("../assets/images/feedcards/landmark/Arcade.jpg");
    case "landmark/Arcade2":
      return require("../assets/images/feedcards/landmark/Arcade2.jpg");
    case "landmark/Arcade3":
      return require("../assets/images/feedcards/landmark/Arcade3.jpg");
    case "landmark/Brighton":
      return require("../assets/images/feedcards/landmark/Brighton.jpg");
    case "landmark/CBD1":
      return require("../assets/images/feedcards/landmark/CBD1.jpg");
    case "landmark/CBD2":
      return require("../assets/images/feedcards/landmark/CBD2.jpg");
    case "landmark/CBD3":
      return require("../assets/images/feedcards/landmark/CBD3.jpg");
    case "landmark/CBD4":
      return require("../assets/images/feedcards/landmark/CBD4.jpg");
    case "landmark/CBD5":
      return require("../assets/images/feedcards/landmark/CBD5.jpg");
    case "landmark/Chinatown":
      return require("../assets/images/feedcards/landmark/Chinatown.jpg");
    case "landmark/Flinder_Station":
      return require("../assets/images/feedcards/landmark/Flinder_Station.jpg");
    case "landmark/Flinder_Station_2":
      return require("../assets/images/feedcards/landmark/Flinder_Station_2.jpg");
    case "landmark/Hare_Krishna_Temple":
      return require("../assets/images/feedcards/landmark/Hare_Krishna_Temple.jpg");
    case "landmark/Park":
      return require("../assets/images/feedcards/landmark/Park.jpg");
    case "landmark/Park2":
      return require("../assets/images/feedcards/landmark/Park2.jpg");
    case "landmark/Pier":
      return require("../assets/images/feedcards/landmark/Pier.jpg");
    case "landmark/Stairs":
      return require("../assets/images/feedcards/landmark/Stairs.jpg");
    case "landmark/Train":
      return require("../assets/images/feedcards/landmark/Train.jpg");
    case "grocery/Grocery":
      return require("../assets/images/feedcards/grocery/Grocery.jpg");
    case "grocery/Market":
      return require("../assets/images/feedcards/grocery/Market.jpg");
    case "pharmacy/Blood_Pressure":
      return require("../assets/images/feedcards/pharmacy/Blood_Pressure.jpg");
    case "pharmacy/Dental":
      return require("../assets/images/feedcards/pharmacy/Dental.jpg");
    case "pharmacy/Fish_Oil":
      return require("../assets/images/feedcards/pharmacy/Fish_Oil.jpg");
    case "pharmacy/Pain":
      return require("../assets/images/feedcards/pharmacy/Pain.jpg");
    case "pharmacy/Pharmacist":
      return require("../assets/images/feedcards/pharmacy/Pharmacist.jpg");
    case "restaurant/Breakie":
      return require("../assets/images/feedcards/restaurant/Breakie.jpg");
    case "restaurant/Burger":
      return require("../assets/images/feedcards/restaurant/Burger.jpg");
    case "restaurant/Chinese Skew":
      return require("../assets/images/feedcards/restaurant/Chinese Skew.jpg");
    case "restaurant/Chinese_Fancy":
      return require("../assets/images/feedcards/restaurant/Chinese_Fancy.jpg");
    case "restaurant/Chinese_Noodles":
      return require("../assets/images/feedcards/restaurant/Chinese_Noodles.jpg");
    case "restaurant/Coffee":
      return require("../assets/images/feedcards/restaurant/Coffee.jpg");
    case "restaurant/Fruit_Bowl":
      return require("../assets/images/feedcards/restaurant/Fruit_Bowl.jpg");
    case "restaurant/Indian_Fried_Food":
      return require("../assets/images/feedcards/restaurant/Indian_Fried_Food.jpg");
    case "restaurant/Indian_Preserved":
      return require("../assets/images/feedcards/restaurant/Indian_Preserved.jpg");
    case "restaurant/Indian_Rojak":
      return require("../assets/images/feedcards/restaurant/Indian_Rojak.jpg");
    case "restaurant/Indian_Roti":
      return require("../assets/images/feedcards/restaurant/Indian_Roti.jpg");
  }
}

const RouteCard: React.FC<CardProps> = ({
  routeResult,
  isSimplified,
  handleFavRoute,
  onPressCard,
  voted = false,
  index,
  shareUrl,
  handlePublishRoute,
}) => {
  const theme = useAppTheme();

  const [menuVisible, setMenuVisible] = React.useState(false);
  const {
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleDateConfirm,
  } = useEventScheduler();
  const { map, printMap } = usePrintMap(routeResult.route);
  return (
    <AnimatedButton
      onPress={onPressCard ? onPressCard : () => { }}
      color={theme.colors.secondaryContainer}
      style={{
        paddingHorizontal: 20,
        overflow: "hidden",
      }}
    >
      {getRouteImage(routeResult.route.route_image_name) && <View>
        <Image
          source={getRouteImage(routeResult.route.route_image_name)}
          style={{
            height: 100,
            left: -50,
          }}
        />
      </View>}
      {/*<View><Text>{routeResult.route.route_image_name}</Text></View>*/}
      {menuVisible && map}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text
          numberOfLines={1}
          lineBreakMode="tail"
          style={[
            styles.card_title,
            {
              color: theme.colors.onSecondaryContainer,
              width: "80%",
            },
          ]}
        >
          {routeResult.route.locations[0]}
        </Text>
        <Text
          style={{
            textAlign: "right",
            color: theme.colors.onSurfaceVariant,
          }}
        >
          {routeResult.route?.created_at
            ? timeSince(routeResult.route?.created_at)
            : ""}
        </Text>
      </View>
      <View style={styles.tags_container}>
        <Text
          style={[
            styles.tag,
            {
              color: theme.colors.onSecondaryContainer,
            },
          ]}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {routeResult.route.locations.map((location) => `#${location} `)}
        </Text>
      </View>
      {!isSimplified && (
        <View style={styles.button_container}>
          <View
            style={{
              height: 42,
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <MaterialCommunityIcons
              name="walk"
              size={20}
              color={theme.colors.secondary}
            />
            <Text
              style={{
                color: theme.colors.secondary,
                marginLeft: 4,
              }}
            >
              {Math.ceil((routeResult.route.duration * 1.5) / 60)} mins
            </Text>
          </View>
          <View
            style={{
              flexDirection: "row",
              gap: 2,
              alignItems: "center",
            }}
          >
            <IconButton
              icon={voted ? "bookmark" : "bookmark-outline"}
              iconColor={theme.colors.onSecondaryContainer}
              mode="outlined"
              onPress={() =>
                handleFavRoute && handleFavRoute(routeResult.route.route_id)
              }
            />

            <Menu
              visible={menuVisible}
              onDismiss={() => setMenuVisible(false)}
              anchor={
                <IconButton
                  mode="contained-tonal"
                  iconColor={theme.colors.onSecondary}
                  containerColor={theme.colors.secondary}
                  icon="dots-vertical"
                  onPress={() => setMenuVisible(true)}
                />
              }
            >
              <Menu.Item title="Schedule" onPress={showDatePicker} />
              <Menu.Item
                onPress={() => {
                  printMap();
                }}
                title="Share"
              />
              <Menu.Item
                onPress={() => shareUrl?.(routeResult.route.route_id)}
                title="Share Link"
              />
              <Menu.Item
                onPress={() => handlePublishRoute?.(routeResult.route.route_id)} // Use the new prop
                title="Publish Route"
              />
            </Menu>
          </View>
        </View>
      )}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="date"
        onConfirm={async (date) => {
          if (handleDateConfirm) {
            handleDateConfirm(date, routeResult.route);
          }
        }}
        onCancel={hideDatePicker}
      />
    </AnimatedButton>
    // </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  row_text: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  text_title: {
    alignContent: "center",
    fontWeight: "bold",
    fontSize: 28,
  },
  card: {
    overflow: "hidden",
  },
  card_title: {
    fontWeight: "bold",
    fontSize: 20,
  },
  card_description: {
    fontSize: 20,
    marginTop: 8,
    marginBottom: 8,
    overflow: "hidden",
    whiteSpace: "nowrap",
    textOverflow: "ellipsis",
  },
  tags_container: {
    flexDirection: "row",
    marginTop: 2,
  },
  tag: {
    fontSize: 14,
    marginRight: 8,
  },
  button_container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },
  button: {},
});


export default RouteCard;
