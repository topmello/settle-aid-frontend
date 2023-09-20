//@ts-nocheck
import React from "react";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { RouteHistory } from "../types/route";
import { useTheme, Button, IconButton } from "react-native-paper";
import { AnimatedButton } from "./AnimatedButton";
import * as Calendar from "expo-calendar";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { useNotification } from "../hooks/useNotification";
import * as Print from "expo-print";
import * as Sharing from "expo-sharing";
import Bookmark from "../assets/images/icons/bookmark.svg";
import { useAppTheme } from "../theme/theme";
import Animated, { FadeOutRight, SlideInRight, Layout } from "react-native-reanimated";

interface CardProps {
  routeResult: RouteHistory;
  isSimplified: boolean;
  handleFavRoute?: (route_id: number) => Promise<void>;
  onPressCard?: () => void;
  voted?: boolean;
  index?: number;
}

const RouteCard: React.FC<CardProps> = ({
  routeResult,
  isSimplified,
  handleFavRoute,
  onPressCard,
  voted = false,
  index
}) => {
  const Wrapper = isSimplified ? AnimatedButton : View;
  const theme = useAppTheme();

  //use notification
  const { pushNotification } = useNotification();

  //confirmation model
  const [isConfirmationModalVisible, setConfirmationModalVisible] =
    useState(false);

  //calendar permission
  const [calendarPermission, setCalendarPermission] = useState(false);

  const requestCalendarPermission = async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setCalendarPermission(status === "granted");
  };

  useEffect(() => {
    requestCalendarPermission();
  }, []);

  //date picker

  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date: Date) => {
    console.warn("A date has been picked: ", date);
    hideDatePicker();
    setSelectedDate(date);
    addToCalendar(date, routeResult.route.locations[0]);
    pushNotification({
      message: "The event has been added to you system calendar!",
      type: "info",
    });
  };

  const generatePDF = async () => {
    try {
      const locations = routeResult.route.locations
        .map((location) => `<p>${location}</p>`)
        .join("");

      const instructions = routeResult.route.instructions
        .map((instruction) => `<p>${instruction}</p>`)
        .join("");

      const cssContent = `
      <style>
          body {
              font-family: Arial, sans-serif;
              margin: 40px;
              background-color: #f4f4f4;
              color: #333;
          }
          h1 {
              background-color: #333;
              color: #fff;
              padding: 10px 20px;
              border-radius: 5px;
          }
          h2 {
              border-bottom: 2px solid #333;
              padding-bottom: 5px;
              margin-top: 30px;
          }
          p {
              margin: 10px 0;
              line-height: 1.6;
              font-size: 16px;
          }
          </style>
          `;
      const htmlContent = `
      <html>
        <head>${cssContent}</head>
        <body>
          <h1>My Events</h1>
          <h2>Locations</h2>
          ${locations} 
          <h2>Instructions</h2>
          ${instructions}
        </body>
      </html>
      `;

      // Generate PDF using expo-print
      const { uri } = await Print.printToFileAsync({ html: htmlContent });

      // Open the generated PDF using expo-sharing
      await Sharing.shareAsync(uri, {
        mimeType: "application/pdf",
        dialogTitle: "Share PDF",
        UTI: "com.adobe.pdf",
        filename: "generated.pdf",
      });

      console.log("PDF saved and opened:", uri);
    } catch (error) {
      console.error("Error generating and opening PDF:", error);
    }
  };

  // add event to calendar

  const addToCalendar = async (date: Date, location: String) => {
    if (calendarPermission) {
      // Get the default calendar
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();

      const eventDetails = {
        title: location,
        startDate: date.toISOString(),
        endDate: date.toISOString(),
        timeZone: "GMT",
        location: "Event Location",
        notes: "Event Description",
      };

      const event = await Calendar.createEventAsync(
        defaultCalendar.id,
        eventDetails
      );

      console.log(`Event added to calendar with ID: ${event}`);
    } else {
      console.warn("Calendar permissions not granted.");
    }
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
    <Animated.View entering={SlideInRight.delay(index*50)} exiting={FadeOutRight} layout={Layout.springify()}>
      <AnimatedButton
      onPress={onPressCard}
      color={theme.colors.infoContainer}
      style={{
        paddingHorizontal: 20,
        overflow: "hidden",
      }}
    >
      <Text style={styles.card_title}>{routeResult.route.locations[0]}</Text>
      <View style={styles.tags_container}>
        <Text
          style={styles.tag}
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {routeResult.route.locations.map((location, index) => `#${location}`)}
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
