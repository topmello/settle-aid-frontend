import { useState, useRef } from "react";

export type MapRegion = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export type Coordinates = {
  latitude: number;
  longitude: number;
};

function useMapRegion(data: any, body: any, mapRef: any) {
  const [region, setRegion] = useState<MapRegion>({
    latitude: body.latitude - 0.005,
    longitude: body.longitude,
    latitudeDelta: 0.01,
    longitudeDelta: 0.03,
  });

  const handleLocationSelect = (location: Coordinates) => {
    const newRegion = {
      ...region,
      latitude: location.latitude - 0.005,
      longitude: location.longitude,
    };

    mapRef.current!.animateCamera({ center: newRegion }, { duration: 1000 });

    setRegion(newRegion);
  };

  const [selectedLocationInstruc, setSelectedLocationInstruc] =
    useState<MapRegion | null>(null);

  const handlePressRoute = (index: number) => {
    if (index < 0 || index >= data.route.length) {
      return;
    }
    const lat1 = data.route[index].latitude;
    const lon1 = data.route[index].longitude;
    const lat2 = data.route[index + 1]?.latitude;
    const lon2 = data.route[index + 1]?.longitude;

    const bearing = lat2 && lon2 ? calculateBearing(lat1, lon1, lat2, lon2) : 0;
    const newRegion = {
      latitude: lat1,
      longitude: lon1,
      latitudeDelta: 0.001,
      longitudeDelta: 0.005,
    };

    mapRef.current!.animateCamera(
      { center: newRegion, heading: bearing },
      { duration: 1000 }
    );
    setSelectedLocationInstruc(newRegion);
  };

  function degreesToRadians(degrees: number): number {
    return (degrees * Math.PI) / 180;
  }

  function calculateBearing(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    lat1 = degreesToRadians(lat1);
    lon1 = degreesToRadians(lon1);
    lat2 = degreesToRadians(lat2);
    lon2 = degreesToRadians(lon2);

    const dLon = lon2 - lon1;
    const x = Math.cos(lat2) * Math.sin(dLon);
    const y =
      Math.cos(lat1) * Math.sin(lat2) -
      Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLon);
    const bearing = (Math.atan2(x, y) * 180) / Math.PI;
    return (bearing + 360) % 360;
  }

  return {
    selectedLocationInstruc,
    region,
    handlePressRoute,
    handleLocationSelect,
  };
}

export default useMapRegion;
