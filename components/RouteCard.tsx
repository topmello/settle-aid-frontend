//@ts-nocheck
import React from "react";
import { useState, useMemo, useRef, useCallback, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native"; // 或者你使用的库
import { RouteHistory } from "../types/route"; // 假设你的RouteResult接口定义在这个文件里
import { useTheme, Button } from "react-native-paper";
import { AnimatedButton } from "./AnimatedButton";
import { useSelector } from "react-redux";
import * as Calendar from "expo-calendar";
import DateTimePickerModal from "react-native-modal-datetime-picker";

// 定义传入的props类型
interface CardProps {
  routeResult: RouteHistory;
  isSimplified: boolean;
  handleFavRoute?: (route_id: number) => Promise<void>;
}

const RouteCard: React.FC<CardProps> = ({
  routeResult,
  isSimplified,
  handleFavRoute,
}) => {
  const Wrapper = isSimplified ? AnimatedButton : View;
  const theme = useTheme();


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
          timeZone: "GMT", // Set the timezone as needed
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
      paddingHorizontal: 16,
      marginTop: 24,
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      height: 80,
    },
    text_title: {
      alignContent: "center",
      fontWeight: "bold",
      fontSize: 28,
    },
    card: {
      backgroundColor: theme.colors.infoContainer,
      // height: 200,
      borderRadius: 15,
      marginHorizontal: 20,
      marginBottom: 20,
      marginTop: 20,
    },
    card_title: {
      fontWeight: "bold",
      fontSize: 28,
      marginTop: 20,
      marginLeft: 20,
      color: theme.colors.info,
    },
    card_description: {
      fontSize: 20,
      marginLeft: 20,
      marginRight: 20,
      marginTop: 8,
      marginBottom: 8,
      overflow: "hidden",
      whiteSpace: "nowrap",
      textOverflow: "ellipsis",
    },
    tags_container: {
      flexDirection: "row",
      marginLeft: 20,
      marginBottom: 20,
      marginTop: 2,
    },
    tag: {
      fontSize: 14,
      marginRight: 8,
      color: theme.colors.info,
    },
    button_container: {
      flexDirection: "row",
      marginLeft: 20,
      marginRight: 16,
      marginTop: 16,
      marginBottom: 20,
    },
    circle: {
      marginLeft: 10,
      marginRight: 10,
      width: 44,
      height: 44,
      borderRadius: 42,
      backgroundColor: theme.colors.info,
    },
    button: {
      marginLeft: 8,
      marginRight: 8,
      width: 110,
    },
  });

  return (
    <Wrapper style={isSimplified ? {} : styles.view}>
      <View style={styles.card}>
        <Text style={styles.card_title}>{routeResult.route.locations[0]}</Text>
        <View style={styles.tags_container}>
          {routeResult.route.locations.map((location, index) => (
            <Text
              key={index}
              style={styles.tag}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {`#${location}`}
            </Text>
          ))}
        </View>
        {!isSimplified && (
          <View style={styles.button_container}>
            <TouchableOpacity
              style={styles.circle}
              onPress={() => handleFavRoute(routeResult.route.route_id)}
            ></TouchableOpacity>
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
              onPress={() => console.log("Pressed")}
              style={styles.button}
            >
              Reuse
            </Button>
          </View>
        )}
      </View>
    </Wrapper>
  );
};

export default RouteCard;
