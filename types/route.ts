export interface Route {
  created_at?: string;
  route_id: number;
  locations: string[];
  locations_coordinates: {
    latitude: number;
    longitude: number;
  }[];
  route: {
    latitude: number;
    longitude: number;
  }[];
  instructions: string[];
  duration: number;
  route_image_name: string;
  location_type: string[];
  query: string[];
  negative_query: string[];
}

export interface RouteGetResult {
  num_votes: number;
  route: Route;
}

export interface RouteHistory {
  num_votes: number;
  route: Route;
  voted_by_user: boolean;
}

export const initialRoute: Route = {
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
  location_type: [],
  query: [],
  negative_query: [],
}
