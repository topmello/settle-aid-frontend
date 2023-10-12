
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Route, initialRoute } from "../types/route";

export interface RouteHistory {
  routeId: number
  route: Route
  history: boolean;
  fromUrl: boolean;
}

export interface Instructions {
  instructions: string[]
}

const RouteHistoryState: RouteHistory = {
  routeId: 0,
  route: initialRoute,
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
      state.fromUrl = false;
    },
    setFromUrl(state, action: PayloadAction<{ routeId: number, history: boolean, fromUrl: boolean }>) {
      state.routeId = action.payload.routeId;
      state.history = action.payload.history;
      state.fromUrl = action.payload.fromUrl;
    },
    setInstructions(state, action: PayloadAction<Instructions>) {
      state.route.instructions = action.payload.instructions;
    },

  }

});


export const {
  setRouteHistory,
  setUseHistory,
  setFromUrl,
  setInstructions
} = routeHistorySlice.actions;

export default routeHistorySlice.reducer;
