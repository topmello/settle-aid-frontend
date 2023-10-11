
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route } from "../types/route";

export interface RouteHistory {
  routeId: number
  route: Route
  history: boolean;
  fromUrl: boolean;
}

const RouteHistoryState: RouteHistory = {
  routeId: 0,
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
  fromUrl: false
}

export const selectRouteId = (state: any): RouteHistory => state.routeHistory.routeId;
export const selectHistoryRoute = (state: any): RouteHistory => state.routeHistory.route;
export const selectUseHistory = (state: any): RouteHistory => state.routeHistory.history;
export const selectFromUrl = (state: any): RouteHistory => state.routeHistory.fromUrl;

const routeHistorySlice = createSlice({
  name: "routeHistory",
  initialState: RouteHistoryState,
  reducers: {
    setRouteHistory(state, action: PayloadAction<{ route: Route, history: boolean, fromUrl: boolean }>) {
      state.route = action.payload.route;
      state.history = action.payload.history;
      state.fromUrl = action.payload.fromUrl;
    },
    setUseHistory(state, action: PayloadAction<boolean>) {
      state.history = action.payload;
    },
    setFromUrl(state, action: PayloadAction<{ routeId: number, history: true, fromUrl: boolean }>) {
      state.routeId = action.payload.routeId;
      state.history = action.payload.history;
      state.fromUrl = action.payload.fromUrl;
    }

  }

});


export const {
  setRouteHistory,
  setUseHistory,
  setFromUrl
} = routeHistorySlice.actions;

export default routeHistorySlice.reducer;
