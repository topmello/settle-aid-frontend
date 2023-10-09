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
