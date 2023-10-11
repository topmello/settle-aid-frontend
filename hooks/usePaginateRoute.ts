
import { useState, useEffect, useRef } from "react";
import useFetch from "./useFetch";
import { useDispatch, useSelector } from "react-redux";
import { loading, loaded } from "../store/appSlice";
import { selectIsLoading } from "../store/appSlice";
import { RouteHistory } from "../types/route";

import { AppDispatch } from "../store";
import { wrap } from "lodash";


const usePaginateRoute = (url: string, routePerPage: number = 6) => {

  const isLoading = useSelector(selectIsLoading);
  const dispatch = useDispatch<AppDispatch>();
  const [accumulatedRouteList, setAccumulatedRouteList] = useState<
    RouteHistory[]
  >([]);

  const offsetRef = useRef(0)

  const [routeList, refetchRouteList] = useFetch<RouteHistory[]>(
    {
      method: "GET",
      url: `${url}?limit=${routePerPage}&order_by=num_votes&offset=${offsetRef.current}`,
    },
    [offsetRef],
    accumulatedRouteList,
    true
  );

  const [, executeVote] = useFetch(
    {
      method: "POST",
      url: `/vote/`,
    },
    [],
    null,
    false,
    "Added to favourites"
  );

  useEffect(() => {
    if (routeList && routeList.length > 0) {
      const filteredList = routeList.filter(
        newRoute => !accumulatedRouteList.some(
          accRoute => accRoute.route.route_id === newRoute.route.route_id
        )
      );
      offsetRef.current += routePerPage
      setAccumulatedRouteList((prev) => [...prev, ...filteredList] as RouteHistory[]);
    }
  }, [routeList]);


  const handleScroll = async (event: any) => {
    if (isLoading || !routeList || routeList.length === 0) return;
    const scrollY = event.nativeEvent.contentOffset.y;
    const windowHeight = event.nativeEvent.layoutMeasurement.height;
    const contentHeight = event.nativeEvent.contentSize.height;

    if (scrollY + windowHeight >= contentHeight - 100 && !isLoading) {
      dispatch(loaded())
      await refetchRouteList();

      setTimeout(() => {
        dispatch(loaded())
      }, 500);
    }
  };

  const handleFavRoute = async (route_id: number) => {
    try {
      await executeVote({
        method: "POST",
        url: `/vote/${route_id}/`,
      });

      setAccumulatedRouteList(prev => {
        return prev.map(route => {
          if (route.route.route_id === route_id) {
            return { ...route, voted_by_user: true }
          }

          return route
        })
      })

    } catch (error) {
      return;
    } finally {
    }
  };


  return [accumulatedRouteList, handleScroll, handleFavRoute] as [RouteHistory[], typeof handleScroll, typeof handleFavRoute]


}

export default usePaginateRoute
