import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch } from "../api/fetch";

export type ChallengeState = {
  routesGenerated: number;
  routesFavouritedShared: number;
  status: "idle" | "loading" | "failed";
};

const initialState: ChallengeState = {
  routesGenerated: 0,
  routesFavouritedShared: 0,
  status: "idle",
};

export const selectRoutesGenerated = (state: any) =>
  state.challenge.routesGenerated;
export const selectRoutesFavoriteShared = (state: any) =>
  state.challenge.routesFavouritedShared;

export const updateRoutesGenerated = createAsyncThunk(
  "challenge/updateRoutesGenerated",
  async (arg, { getState }) => {
    const state = getState() as any;
    console.log("state.auth.id", state.auth.id);
    const response = await fetch({
      method: "POST",
      url: `/challenge/route_generation/${state.auth.id}/`,
      data: {
        routes_generated: state.challenge.routesGenerated,
      },
    });
    return response.data;
  }
);

export const updateRoutesFavouritedShared = createAsyncThunk(
  "challenge/updateRoutesFavouritedShared",
  async (arg, { getState }) => {
    const state = getState() as any;
    const response = await fetch({
      method: "POST",
      url: `/challenge/favourite_sharing/${state.auth.id}/`,
      data: {
        routes_favourited_shared: state.challenge.routesFavouritedShared,
      },
    });
    return response.data;
  }
);

const challengeSlice = createSlice({
  name: "challenge",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(updateRoutesGenerated.fulfilled, (state, action) => {
      state.routesGenerated = action.payload.routes_generated;
      state.status = "idle";
    });

    builder.addCase(updateRoutesGenerated.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesGenerated.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateRoutesFavouritedShared.fulfilled, (state, action) => {
      state.routesFavouritedShared = action.payload.routes_favourited_shared;
      state.status = "idle";
    });

    builder.addCase(updateRoutesFavouritedShared.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesFavouritedShared.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export default challengeSlice.reducer;
