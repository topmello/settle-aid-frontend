import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { fetch } from "../api/fetch";

export type ChallengeState = {
  lastLogin: Date | null;
  status: "idle" | "loading" | "failed";
};

const initialState: ChallengeState = {
  lastLogin: null,
  status: "idle",
};

export const selectRoutesGenerated = (state: any) =>
  state.challenge.routesGenerated;
export const selectRoutesFavoriteShared = (state: any) =>
  state.challenge.routesFavouritedShared;

export const updateRoutesGenerated = createAsyncThunk(
  "challenge/updateRoutesGenerated",
  async (arg, { getState }) => {
    console.log("updateRoutesGenerated");
    const response = await fetch({
      method: "POST",
      url: `/challenge/route_generation/`,
      data: {
        routes_generated: 1,
      },
    });
    return response.data;
  }
);

export const updateRoutesFavourited = createAsyncThunk(
  "challenge/updateRoutesFavourited",
  async (arg, { getState }) => {
    const response = await fetch({
      method: "POST",
      url: `/challenge/favourited/`,
      data: {
        routes_favourited_shared: 1,
      },
    });
    return response.data;
  }
);

export const updateRoutesShared = createAsyncThunk(
  "challenge/updateRoutesShared",
  async (arg, { getState }) => {
    const response = await fetch({
      method: "POST",
      url: `/challenge/shared/`,
      data: {
        routes_favourited_shared: 1,
      },
    });
    return response.data;
  }
);

export const updateRoutesPublished = createAsyncThunk(
  "challenge/updateRoutesPublished",
  async (arg, { getState }) => {
    const state = getState() as any;
    const response = await fetch({
      method: "POST",
      url: `/challenge/published/`,
      data: {
        routes_published: 1,
      },
    });
    return response.data;
  }
);

export const updateRoutesTipsRead = createAsyncThunk(
  "challenge/updateRoutesTipsRead",
  async (arg, { getState }) => {
    const state = getState() as any;
    const response = await fetch({
      method: "POST",
      url: `/challenge/tips_read/`,
      data: {
        routes_tips_read: 1,
      },
    });
    return response.data;
  }
);

export const updateRoutesLoggedIn = createAsyncThunk(
  "challenge/updateRoutesLoggedIn",
  async (arg, { getState }) => {
    const state = getState() as any;
    if (
      !state.challenge.lastLogin ||
      (state.challenge.lastLogin.getDay() !== new Date().getDay() &&
        state.challenge.lastLogin.getMonth() !== new Date().getMonth() &&
        state.challenge.lastLogin.getFullYear() !== new Date().getFullYear())
    ) {
      const response = await fetch({
        method: "POST",
        url: `/challenge/logged_in/${state.auth.id}/`,
        data: {
          routes_logged_in: 1,
        },
      });
      return response.data;
    } else {
      return {};
    }
  }
);

export const updateAccessedGlobalFeed = createAsyncThunk(
  "challenge/updateAccessedGlobalFeed",
  async (arg, { getState }) => {
    const state = getState() as any;
    const response = await fetch({
      method: "POST",
      url: `/challenge/accessed_global_feed/${state.auth.id}/`,
      data: {
        access_global_feed: 1,
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
      state.status = "idle";
    });

    builder.addCase(updateRoutesGenerated.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesGenerated.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateRoutesFavourited.fulfilled, (state, action) => {
      state.status = "idle";
    });

    builder.addCase(updateRoutesFavourited.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesFavourited.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateRoutesShared.fulfilled, (state, action) => {
      state.status = "idle";
    });

    builder.addCase(updateRoutesShared.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesShared.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateRoutesPublished.fulfilled, (state, action) => {
      state.status = "idle";
    });

    builder.addCase(updateRoutesPublished.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesPublished.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateRoutesTipsRead.fulfilled, (state, action) => {
      state.status = "idle";
    });

    builder.addCase(updateRoutesTipsRead.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesTipsRead.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateRoutesLoggedIn.fulfilled, (state, action) => {
      state.status = "idle";
    });

    builder.addCase(updateRoutesLoggedIn.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateRoutesLoggedIn.rejected, (state, action) => {
      state.status = "failed";
    });

    builder.addCase(updateAccessedGlobalFeed.fulfilled, (state, action) => {
      state.status = "idle";
    });

    builder.addCase(updateAccessedGlobalFeed.pending, (state, action) => {
      state.status = "loading";
    });

    builder.addCase(updateAccessedGlobalFeed.rejected, (state, action) => {
      state.status = "failed";
    });
  },
});

export default challengeSlice.reducer;
