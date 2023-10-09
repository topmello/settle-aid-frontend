import { useDispatch } from "react-redux";
import { AppDispatch } from "../store";
import {
  updateRoutesFavourited,
  updateRoutesGenerated,
  updateRoutesShared,
  updateRoutesPublished,
  updateRoutesTipsRead,
  updateRoutesLoggedIn,
  updateAccessedGlobalFeed,
} from "../store/challengeSlice";
import { useSession } from "./useSession";

export type Achievement =
  | "routeGeneration"
  | "routeFavourited"
  | "routeShared"
  | "routePublished"
  | "tipsRead"
  | "loggedIn"
  | "accessedGlobalFeed";

export const useAchievement = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { checkSession } = useSession();

  const achieve = (achievement: Achievement) => {
    checkSession().then((res) => {
      if (res) {
        switch (achievement) {
          case "routeGeneration":
            dispatch(updateRoutesGenerated());
            break;
          case "routeFavourited":
            dispatch(updateRoutesFavourited());
            break;
          case "routeShared":
            dispatch(updateRoutesShared());
            break;
          case "routePublished":
            dispatch(updateRoutesPublished());
            break;
          case "tipsRead":
            dispatch(updateRoutesTipsRead());
            break;
          case "loggedIn":
            dispatch(updateRoutesLoggedIn());
            break;
          case "accessedGlobalFeed":
            dispatch(updateAccessedGlobalFeed());
            break;
        }
      }
    });
  };

  return achieve;
};
