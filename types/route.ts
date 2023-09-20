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

export interface Route extends RouteResult {
  route_id: number;
}

export interface RouteHistory {
  num_votes: number;
  route: Route;
  voted_by_user: boolean;
}
