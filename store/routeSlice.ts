import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createSelector } from "reselect";
import { SupportedLanguage } from "./appSlice";

export type LocationType = "landmark" | "restaurant" | "grocery" | "pharmacy";

export type RouteType = "driving" | "walking" | "cycling";


export interface RouteState {
  location_type: LocationType[];
  query: string[];
  negative_query: string[];
  longitude: number;
  latitude: number;
  distance_threshold: number; //This is distance between each location in meters
  similarity_threshold: number; //0-1
  negative_similarity_threshold: number; // 0-1
  route_type: RouteType;
  language?: SupportedLanguage;
}

const initialState: RouteState = {
  location_type: [],
  query: [],
  negative_query: [],
  longitude: 144.9631, // Melbourne Location
  latitude: -37.8136, // Melbourne Location
  distance_threshold: 1000,
  similarity_threshold: 0,
  route_type: "walking",
  negative_similarity_threshold: 0,
  language: "en-AU"
};

const selectRoute = (state: { route: RouteState }) => state.route;
const selectLongitude = (state: { route: RouteState }) => state.route.longitude;
const selectLatitude = (state: { route: RouteState }) => state.route.latitude;

export const selectLocationType = createSelector(
  [selectRoute],
  (route) => route.location_type
);

export const selectQuery = createSelector(
  [selectRoute],
  (route) => route.query
);

export const selectLonLat = createSelector(
  [selectLongitude, selectLatitude],
  (long, lat) => ({
    longitude: long,
    latitude: lat,
  })
);

export const selectDistanceThres = createSelector(
  [selectRoute],
  (route) => route.distance_threshold
);

export const selectRouteState = createSelector([selectRoute], (route) => route);

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
        negative_query: string[];
      }>
    ) {
      if (action.payload.location_type.length === action.payload.query.length) {
        state.location_type = action.payload.location_type;
        state.query = action.payload.query;
        state.negative_query = action.payload.negative_query;
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
      action: PayloadAction<{ similarity_threshold: number, negative_similarity_threshold: number }>
    ) {
      if (action.payload.similarity_threshold < 0 || action.payload.negative_similarity_threshold < 0) {
        state.similarity_threshold = 0;
        state.negative_similarity_threshold = 0;
      } else {
        state.similarity_threshold = action.payload.similarity_threshold;
        state.negative_similarity_threshold = action.payload.negative_similarity_threshold
      }
    },
    setRouteType(state, action: PayloadAction<{ route_type: RouteType }>) {
      state.route_type = action.payload.route_type;
    },
    setRouteLanguage(state, action: PayloadAction<{ language: SupportedLanguage }>) {

      state.language = action.payload.language; //to translate input to english
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
  setRouteLanguage
} = routeSlice.actions;

export default routeSlice.reducer;
