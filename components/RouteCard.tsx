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
import { getRouteImage } from "../utils/routeImage";

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
      onPress={onPressCard ? onPressCard : () => {}}
      color={theme.colors.secondaryContainer}
      style={{
        padding: 0,
        overflow: "hidden",
      }}
    >
      {getRouteImage(routeResult.route.route_image_name) && (
        <View>
          <Image
            source={getRouteImage(routeResult.route.route_image_name)}
            style={{
              height: 100,
            }}
          />
        </View>
      )}
      {/*<View><Text>{routeResult.route.route_image_name}</Text></View>*/}
      {menuVisible && map}
      <View
        style={{
          paddingHorizontal: 16,
          paddingBottom: 16,
          paddingTop: 8,
        }}
      >
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
                  onPress={() =>
                    handlePublishRoute?.(routeResult.route.route_id)
                  } // Use the new prop
                  title="Publish Route"
                />
              </Menu>
            </View>
          </View>
        )}
      </View>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
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
