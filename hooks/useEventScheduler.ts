import { useState, useEffect, useCallback } from "react";
import * as Calendar from "expo-calendar";
import { useNotification } from "./useNotification";
import { Route, RouteResult } from "../types/route";

const useEventScheduler = () => {
  // Notification
  const { pushNotification } = useNotification();

  // Calendar permission
  const [calendarPermission, setCalendarPermission] = useState(false);

  const requestCalendarPermission = useCallback(async () => {
    const { status } = await Calendar.requestCalendarPermissionsAsync();
    setCalendarPermission(status === "granted");
  }, []);

  useEffect(() => {
    requestCalendarPermission();
  }, [requestCalendarPermission]);

  // Date picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const addToCalendar = async (date: Date, route: Route | RouteResult) => {
    if (calendarPermission) {
      // Get the default calendar
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();

      const eventDetails = {
        title: route.locations[0],
        startDate: date.toISOString(),
        endDate: date.toISOString(),
        timeZone: "GMT",
        location: route.locations.map((location) => location).join(" - "),
        notes: route.instructions.map((instruction) => instruction).join("\n"),
      };

      await Calendar.createEventAsync(defaultCalendar.id, eventDetails)
        .then((event) => {
          pushNotification({
            message: "The event has been added to your system calendar!",
            type: "info",
          });
          return;
        })
        .catch((error) => {
          pushNotification({
            message: "The event could not be added to your system calendar!",
            type: "error",
          });
          return;
        });
    }
  };

  const handleDateConfirm = useCallback(
    async (date: Date, route: Route | RouteResult) => {
      await addToCalendar(date, route)
        .then(() => {
          hideDatePicker();
        })
        .catch((error) => {
          return;
        });
    },
    [hideDatePicker, pushNotification]
  );

  return {
    isDatePickerVisible,
    showDatePicker,
    hideDatePicker,
    handleDateConfirm,
  };
};

export default useEventScheduler;
