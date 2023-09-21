import { useState, useEffect, useCallback } from "react";
import * as Calendar from "expo-calendar";
import { useNotification } from "./useNotification";
import { Route, RouteResult } from "../types/route";

const useEventScheduler = () => {
  // Notification
  const { pushNotification } = useNotification();

  // Calendar permission
  const [calendarPermission, setCalendarPermission] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchCalendarPermission = async () => {
      const { status } = await Calendar.requestCalendarPermissionsAsync();
      if (isMounted) {
        setCalendarPermission(status === "granted");
      }
    };

    fetchCalendarPermission();

    return () => {
      isMounted = false;
    };
  }, []);

  // Date picker
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = useCallback(() => {
    setDatePickerVisibility(true);
  }, []);

  const hideDatePicker = useCallback(() => {
    setDatePickerVisibility(false);
  }, []);

  const addToCalendar = async (date: Date, route: Route | RouteResult) => {
    const { status } = await Calendar.getCalendarPermissionsAsync();

    if (status !== "granted") {
      // Handle lack of permissions, for example:
      pushNotification({
        message: "Calendar permissions are required to add an event!",
        type: "warning",
      });
      return;
    }

    if (calendarPermission) {
      const defaultCalendar = await Calendar.getDefaultCalendarAsync();

      const eventDetails = {
        title: route.locations[0],
        startDate: date.toISOString(),
        endDate: date.toISOString(),
        timeZone: "GMT",
        location: route.locations.map((location) => location).join(" - "),
        notes: route.instructions.map((instruction) => instruction).join("\n"),
      };

      try {
        const event = await Calendar.createEventAsync(
          defaultCalendar.id,
          eventDetails
        );
        pushNotification({
          message: "The event has been added to your calendar!",
          type: "info",
        });
        return;
      } catch (error) {
        pushNotification({
          message: "The event could not be added to your calendar!",
          type: "error",
        });
        return;
      }
    }
  };

  const handleDateConfirm = useCallback(
    async (date: Date, route: Route | RouteResult) => {
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
