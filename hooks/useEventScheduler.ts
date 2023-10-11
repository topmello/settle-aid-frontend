import { useState, useEffect, useCallback } from "react";
import * as Calendar from "expo-calendar";
import { useNotification } from "./useNotification";
import { Route } from "../types/route";
import { Platform } from "react-native";

const useEventScheduler = () => {
  // Notification
  const { pushNotification } = useNotification();

  // Date picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const addToCalendar = async (date: Date, route: Route) => {
    const fetchCalendarPermission = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (status === "granted") {
        return true;
      } else {
        pushNotification({
          message: "Calendar permissions are required to add an event!",
          type: "warning",
        });
        return false;
      }
    };

    if (!(await fetchCalendarPermission())) {
      return;
    }

    let defaultCalendar;

    if (Platform.OS === "ios") {
      defaultCalendar = await Calendar.getDefaultCalendarAsync();
    } else if (Platform.OS === "android") {
      const calendars = await Calendar.getCalendarsAsync();
      defaultCalendar = calendars.find(
        (calendar) =>
          calendar.accessLevel === Calendar.CalendarAccessLevel.OWNER &&
          calendar.allowsModifications === true &&
          calendar.isVisible === true
      );
    }

    const eventDetails = {
      title: route.locations[0],
      startDate: date.toISOString(),
      endDate: new Date(
        date.getTime() + Math.ceil(route.duration * 1.5 * 1000)
      ).toISOString(),
      timeZone: "GMT",
      location: route.locations.map((location) => location).join(" - "),
      notes: route.instructions.map((instruction) => instruction).join("\n"),
    };

    try {
      if (defaultCalendar) {
        await Calendar.createEventAsync(defaultCalendar.id, eventDetails);
        pushNotification({
          message: `Event added ${defaultCalendar.name}`,
          type: "info",
        });
      } else {
        pushNotification({
          message: "No default calendar app found!",
          type: "error",
        });
      }
      return;
    } catch (error) {
      pushNotification({
        message: "Event could not be added to your calendar!",
        type: "error",
      });
      return;
    }
  };

  const handleDateConfirm = useCallback(
    async (date: Date, route: Route) => {
      try {
        await addToCalendar(date, route);
        hideDatePicker();
      } catch (error) {
        return;
      }
    },
    [hideDatePicker, addToCalendar, pushNotification]
  );

  return {
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleDateConfirm,
  };
};

export default useEventScheduler;
