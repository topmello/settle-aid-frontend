import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type LocationType = "landmark" | "restaurant" | "grocery" | "pharmacy";

export type RouteType = "driving" | "walking" | "cycling";

export interface RouteState {
  location_type: LocationType[];
  query: string[];
  longitude: number;
  latitude: number;
  distance_threshold: number; //This is actually distance between each location in meters
  similarity_threshold: number; //0-1
  route_type: RouteType;
}

const initialState: RouteState = {
  location_type: [],
  query: [],
  longitude: 0,
  latitude: 0,
  distance_threshold: 1000,
  similarity_threshold: 0,
  route_type: "walking",
};

export const selectLocationType = (state: { route: RouteState }) =>
  state.route.location_type;
export const selectQuery = (state: { route: RouteState }) => state.route.query;

const routeSlice = createSlice({
  name: "route",
  initialState,
  reducers: {
    setLocationType(state, action: PayloadAction<LocationType[]>) {
      state.location_type = action.payload;
    },
    setQueryWithLocationType(
      state,
      action: PayloadAction<{
        location_type: LocationType[];
        query: string[];
      }>
    ) {
      if (action.payload.location_type.length === action.payload.query.length) {
        state.location_type = action.payload.location_type;
        state.query = action.payload.query;
      } else {
        console.error("location_type and query must be of the same length");
      }
    },
    setLonLat(
      state,
      action: PayloadAction<{ longitude: number; latitude: number }>
    ) {
      state.longitude = action.payload.longitude;
      state.latitude = action.payload.latitude;
    },
    setDistanceThreshold(
      state,
      action: PayloadAction<{ distance_threshold: number }>
    ) {
      state.distance_threshold = action.payload.distance_threshold;
    },
    setSimilarityThreshold(
      state,
      action: PayloadAction<{ similarity_threshold: number }>
    ) {
      if (action.payload.similarity_threshold < 0) {
        state.similarity_threshold = 0;
      } else {
        state.similarity_threshold = action.payload.similarity_threshold;
      }
    },
    setRouteType(state, action: PayloadAction<{ route_type: RouteType }>) {
      state.route_type = action.payload.route_type;
    },
  },
});

export const {
  setLocationType,
  setQueryWithLocationType,
  setLonLat,
  setDistanceThreshold,
  setSimilarityThreshold,
  setRouteType,
} = routeSlice.actions;

export default routeSlice.reducer;
