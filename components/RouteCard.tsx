//@ts-nocheck
import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Route, RouteHistory } from "../types/route";
import { Button, IconButton } from "react-native-paper";
import { AnimatedButton } from "./AnimatedButton";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import { useAppTheme } from "../theme/theme";
import Animated, {
  FadeOutRight,
  Layout,
  FadeInRight,
} from "react-native-reanimated";
import generatePDF from "../utils/generatePDF";
import Animated, {
  FadeOutRight,
  SlideInRight,
  Layout,
  FadeInRight,
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
      justifyContent: "flex-end",
      alignItems: "center",
      marginTop: 16,
    },
    button: {
      marginLeft: 8,
    },
  });

  return (
    <Animated.View
      entering={FadeInRight.delay(index * 50)}
      exiting={FadeOutRight}
      layout={Layout.damping()}
    >
      <AnimatedButton
        onPress={onPressCard}
        color={theme.colors.infoContainer}
        style={{
          paddingHorizontal: 20,
          overflow: "hidden",
        }}
      >
        <Text
          style={[
            styles.card_title,
            {
              color: theme.colors.info,
            },
          ]}
        >
          {routeResult.route.locations[0]}
        </Text>
        <View style={styles.tags_container}>
          <Text
            style={[
              styles.tag,
              {
                color: theme.colors.info,
              },
            ]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
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
              onPress={() => handleFavRoute(routeResult.route.route_id)}
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
              onConfirm={handleConfirm}
              onCancel={hideDatePicker}
            />

            <Button
              mode="outlined"
              textColor={theme.colors.info}
              onPress={generatePDF}
              style={styles.button}
            >
              Share
            </Button>
          </View>
        )}
      </AnimatedButton>
    </Animated.View>
  );
};

export default RouteCard;
