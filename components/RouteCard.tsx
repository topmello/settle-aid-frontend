import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Route, RouteHistory } from "../types/route";
import { Button, IconButton } from "react-native-paper";
import { AnimatedButton } from "./AnimatedButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useAppTheme } from "../theme/theme";
import generatePDF from "../utils/generatePDF";
import Animated, {
  FadeInRight,
  FadeOutRight,
  Layout,
} from "react-native-reanimated";

interface CardProps {
  routeResult: RouteHistory;
  isSimplified: boolean;
  handleFavRoute?: (route_id: number) => Promise<void>;
  onPressCard?: () => void;
  voted?: boolean;
  index?: number;
  isDatePickerVisible?: boolean;
  showDatePicker?: () => void;
  hideDatePicker?: () => void;
  handleDateConfirm?: (date: Date, route: Route) => void;
  getUrl?: () => Promise<void>;
}

const RouteCard: React.FC<CardProps> = ({
  routeResult,
  isSimplified,
  handleFavRoute,
  onPressCard,
  voted = false,
  index,
  isDatePickerVisible,
  showDatePicker,
  hideDatePicker,
  handleDateConfirm,
  getUrl,
}) => {
  const theme = useAppTheme();

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
      color: theme.colors.info,
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
      color: theme.colors.info,
    },
    button_container: {
      flexDirection: "row",
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 16,
    },
    circle: {
      width: 34,
      height: 34,
      borderRadius: 42,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: theme.colors.info,
    },
    button: {
      marginLeft: 8,
    },
  });

  return (
    <Animated.View
      entering={FadeInRight.delay(index ? index * 50 : 0)}
      exiting={FadeOutRight}
      layout={Layout.damping(1)}
    >
      <AnimatedButton
        onPress={onPressCard ? onPressCard : () => {}}
        color={theme.colors.infoContainer}
        style={{
          paddingHorizontal: 20,
          overflow: "hidden",
        }}
      >
        <Text style={styles.card_title}>{routeResult.route.locations[0]}</Text>
        <View style={styles.tags_container}>
          <Text style={styles.tag} numberOfLines={1} ellipsizeMode="tail">
            {routeResult.route.locations.map(
              (location, index) => `#${location}`
            )}
          </Text>
        </View>
        {!isSimplified && (
          <View style={styles.button_container}>
            <IconButton
              icon={voted ? "bookmark" : "bookmark-outline"}
              theme={{
                colors: {
                  onPrimary: theme.colors.info,
                  primary: theme.colors.onInfo,
                  surfaceVariant: theme.colors.info,
                },
              }}
              mode="contained"
              onPress={() =>
                handleFavRoute && handleFavRoute(routeResult.route.route_id)
              }
            />
            <Button
              mode="outlined"
              textColor={theme.colors.info}
              onPress={showDatePicker}
              style={styles.button}
            >
              Schedule
            </Button>

            <DateTimePickerModal
              isVisible={isDatePickerVisible}
              mode="date"
              onConfirm={async (date) => {
                if (handleDateConfirm) {
                  handleDateConfirm(date, routeResult.route);
                }
              }}
              onCancel={hideDatePicker ? hideDatePicker : () => {}}
            />

            <Button
              mode="outlined"
              textColor={theme.colors.info}
              onPress={() => {
                generatePDF(routeResult.route);
              }}
              style={styles.button}
            >
              Share
            </Button>

            <Button
              mode="outlined"
              textColor={theme.colors.info}
              onPress={getUrl}
              style={styles.button}
            >
              Share Link
            </Button>
          </View>
        )}
      </AnimatedButton>
    </Animated.View>
  );
};

export default RouteCard;
