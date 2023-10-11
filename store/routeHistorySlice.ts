
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route } from "../types/route";

export interface RouteHistory {
  route: Route
  history: boolean;
}

const RouteHistoryState: RouteHistory = {
  route: {
    route_id: 0,
    locations: [],
    locations_coordinates: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
    route: [
      {
        latitude: 0,
        longitude: 0,
      },
    ],
    instructions: [],
    duration: 0,
    route_image_name: "",
  },
  history: false,
}

export const selectHistoryRoute = (state: any): RouteHistory => state.routeHistory.route;
export const selectUseHistory = (state: any): RouteHistory => state.routeHistory.history;

const routeHistorySlice = createSlice({
  name: "routeHistory",
  initialState: RouteHistoryState,
  reducers: {
    setRouteHistory(state, action: PayloadAction<RouteHistory>) {
      state.route = action.payload.route;
      state.history = action.payload.history;
    },
    setUseHistory(state, action: PayloadAction<boolean>) {
      state.history = action.payload;
    }

  }

});


export const {
  setRouteHistory,
  setUseHistory
} = routeHistorySlice.actions;

export default routeHistorySlice.reducer;
