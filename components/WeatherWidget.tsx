import { View } from "react-native";
import { Text } from "react-native-paper";
import LightCloudyIcon from "../assets/images/weather/light_cloudy.svg";
import CloudyIcon from "../assets/images/weather/cloudy.svg";
import SunnyIcon from "../assets/images/weather/sunny.svg";
import NightIcon from "../assets/images/weather/night.svg";
import RainIcon from "../assets/images/weather/rain.svg";
import HeavyRainIcon from "../assets/images/weather/heavy_rain.svg";
import ThunderStormIcon from "../assets/images/weather/thunder_storm.svg";
import FogIcon from "../assets/images/weather/fog.svg";
import SnowIcon from "../assets/images/weather/snow.svg";
import { useAppTheme } from "../theme/theme";
import { AnimatedButton } from "./AnimatedButton";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import useFetch from "../hooks/useFetch";
import { fetch } from "../api/fetch";
import React from "react";

export type WeatherOption = {
  ids: string[];
  name: string;
  icon: any;
  iconNight?: any;
  tempNight?: number;
  tempDay?: number;
};

const weatherOptions: WeatherOption[] = [
  {
    ids: ["800"],
    name: "Clear",
    icon: <SunnyIcon />,
    iconNight: <NightIcon />,
  },
  {
    ids: ["801", "802"],
    name: "Light Cloudy",
    icon: <LightCloudyIcon />,
  },
  {
    ids: ["803"],
    name: "Cloudy",
    icon: <CloudyIcon />,
  },
  {
    ids: ["804"],
    name: "Overcast",
    icon: <CloudyIcon />,
  },
  {
    ids: [
      "300",
      "301",
      "302",
      "310",
      "311",
      "312",
      "313",
      "314",
      "321",
      "500",
      "501",
    ],
    name: "Rain",
    icon: <RainIcon />,
  },
  {
    ids: ["502", "503", "504", "511", "520", "521", "522", "531"],
    name: "Heavy Rain",
    icon: <HeavyRainIcon />,
  },
  {
    ids: ["200", "201", "202", "210", "211", "212", "221", "230", "231", "232"],
    name: "Thunderstorm",
    icon: <ThunderStormIcon />,
  },
  {
    ids: ["700", "711", "721", "731", "741", "751", "761", "762", "771", "781"],
    name: "Fog",
    icon: <FogIcon />,
  },
  {
    ids: [
      "600",
      "601",
      "602",
      "611",
      "612",
      "613",
      "615",
      "616",
      "620",
      "621",
      "622",
    ],
    name: "Snow",
    icon: <SnowIcon />,
  },
];

export const WeatherWidget = () => {
  const theme = useAppTheme();
  const { t } = useTranslation();

  const [weatherData, setWeatherData] = useState<any>(undefined);

  const [currentWeatherOption, setCurrentWeatherOption] = useState<
    WeatherOption | undefined
  >({
    ids: [],
    name: "Sunny",
    icon: <SunnyIcon />,
    tempDay: 20,
    tempNight: 10,
  });

  useEffect(() => {
    fetch({
      method: "GET",
      url: "https://api.openweathermap.org/data/3.0/onecall?lat=-37.814&lon=144.963&units=metric&exclude=hourly,minutely,current,alerts&appid=2530f69826ffe3f4cd3d72d17fe1f3c2",
    })
      .then((response) => {
        setWeatherData(response);
      })
      .catch((error) => {
        console.log(error.response);
      });
  }, []);

  const isNight = React.useMemo(() => {
    const date = new Date();
    const hours = date.getHours();
    return hours < 6 || hours > 18;
  }, []);

  useEffect(() => {
    if (weatherData?.data) {
      const weather = weatherData?.data?.daily?.[0]?.weather[0];
      const weatherOption = weatherOptions.find((option) =>
        option.ids.includes(weather.id.toString())
      );
      if (weatherOption) {
        setCurrentWeatherOption({
          ...weatherOption,
          tempDay: Math.round(weatherData?.data?.daily?.[0]?.feels_like?.day),
          tempNight: Math.round(
            weatherData?.data?.daily?.[0]?.feels_like?.night
          ),
        });
      }
    }
  }, [weatherData?.data]);

  return (
    <AnimatedButton
      color={theme.colors.amberContainer}
      style={{
        paddingVertical: 12,
      }}
      onPress={() => {}}
    >
      {React.cloneElement(
        isNight && currentWeatherOption?.iconNight
          ? currentWeatherOption?.iconNight
          : currentWeatherOption?.icon,
        {
          style: {
            position: "absolute",
            top: -28,
            left: 0,
          },
          height: 120,
          width: 120,
        }
      )}
      <View
        style={{
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
        }}
      >
        <Text
          variant="headlineLarge"
          style={{
            fontWeight: "bold",
          }}
        >
          {currentWeatherOption?.tempNight}-{currentWeatherOption?.tempDay} C°
        </Text>
        <Text
          variant="bodySmall"
          style={{
            fontWeight: "bold",
          }}
        >
          {currentWeatherOption?.name &&
            t(currentWeatherOption?.name, { ns: "home" })}
        </Text>
      </View>
    </AnimatedButton>
  );
};
