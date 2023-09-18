export interface RouteResult {
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
}

export interface RouteHistory extends RouteResult {
  route_id: string;
  num_votes: number;
}

export interface RouteHistoryList {
  routes: RouteHistory[];
}
