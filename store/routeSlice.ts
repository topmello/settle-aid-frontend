import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface RouteState {
  location_type: ("landmark" | "restaurant" | "grocery" | "pharmacy")[];
  query: string[];
  longitude: number;
  latitude: number;
  distance_threshold: number;
  similarity_threshold: number;
  route_type: string;
}

const initialState: RouteState = {
  location_type: [],
  query: [],
  longitude: 0,
  latitude: 0,
  distance_threshold: 0,
  similarity_threshold: 0,
  route_type: "",
};
