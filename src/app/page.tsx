"use client";

import Container from "@/Components/Container";
import ForecastWeatherDetail from "@/Components/ForecastWeatherDetail";
import Navber from "@/Components/Navber";
import WeatherDetails from "@/Components/WeatherDetails";
import WeatherIcon from "@/Components/WeatherIcon";
import { convertKelvinToCelsius } from "@/utils/convertKelvinToCelsius";
import { convertWindSpeed } from "@/utils/convertWindSpeed";
import { fetchWeather } from "@/utils/fetchWeather";
import { getDayOrNightIcon } from "@/utils/getDayOrNightIcon";
import { metersToKilometers } from "@/utils/metersToKilometers";
import axios from "axios";
import { format } from "date-fns";
import { parseISO } from "date-fns/parseISO";
import Image from "next/image";
import { useEffect } from "react";
import { useQuery } from "react-query";

// types/weather.ts

interface WeatherDetail {
  dt: number;
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    sea_level: number;
    grnd_level: number;
    humidity: number;
    temp_kf: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  clouds: {
    all: number;
  };
  wind: {
    speed: number;
    deg: number;
    gust: number;
  };
  visibility: number;
  pop: number;
  sys: {
    pod: string;
  };
  dt_txt: string;
}

interface WeatherData {
  cod: string;
  message: number;
  cnt: number;
  list: WeatherDetail[];
  city: {
    id: number;
    name: string;
    coord: {
      lat: number;
      lon: number;
    };
    country: string;
    population: number;
    timezone: number;
    sunrise: number;
    sunset: number;
  };
}

//https://api.openweathermap.org/data/2.5/forecast?q=bangladesh&appid=ad47c109e79c91844edaf602af5ec00f&cnt=56

export default function Home() {
  const { isLoading, error, data } = useQuery<WeatherData>(
    "repoData",
    async () => {
      const { data } = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?q=bangladesh&appid=${process.env.NEXT_PUBLIC_WEATHER_KEY}&cnt=56`
      );
      return data;
    }
  );
  console.log(data?.city);
  if (isLoading)
    return (
      <div className="flex items-center min-h-screen justify-center">
        <p className="animate-bounce">Loading...</p>
      </div>
    );
  const firstData = data?.list[0];
  return (
    <div className="flex flex-col gap-4 bg-gray-100 min-h-screen ">
      <Navber />
      <main className="px-3 max-w-7xl mx-auto flex flex-col gap-9  w-full  pb-10 pt-4 ">
        {/* todays data */}
        <section className="flex flex-col gap-5" >
          <div className="">
            <h2 className="flex gap-2 items-end">
              <p className="text-2xl">
                {" "}
                {format(parseISO(firstData?.dt_txt ?? ""), "EEEE")}
              </p>

              <p className="text-lg">
                ({format(parseISO(firstData?.dt_txt ?? ""), "dd.MM.yyyy")})
              </p>
            </h2>
            <Container className="gap-10 px-6 items-center">
              {/* temprature */}
              <div className="flex flex-col px-4">
                <span className="text-5xl">
                  {convertKelvinToCelsius(firstData?.main.temp ?? 296.37)}°
                </span>
                <p className="text-xs space-x-1 whitespace-nowrap">
                  <span> Feels like</span>
                  <span>
                    {convertKelvinToCelsius(firstData?.main.feels_like ?? 0)}°
                  </span>
                </p>
                <p className="text-xs space-x-2">
                  <span>
                    {convertKelvinToCelsius(firstData?.main.temp_min ?? 0)}
                    °↓{" "}
                  </span>
                  <span>
                    {" "}
                    {convertKelvinToCelsius(firstData?.main.temp_max ?? 0)}
                    °↑
                  </span>
                </p>
              </div>
              {/* time  and weather  icon */}
              <div className="flex gap-10 sm:gap-16 overflow-x-auto w-full justify-between pr-3">
                {data?.list.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col justify-between gap-2 items-center text-xs font-semibold "
                  >
                    <p className="whitespace-nowrap">
                      {format(parseISO(d.dt_txt), "h:mm a")}
                    </p>

                    {/* <WeatherIcon iconName={d.weather[0].icon} /> */}
                    <WeatherIcon
                      iconName={getDayOrNightIcon(d.weather[0].icon, d.dt_txt)}
                    />
                    <p>{convertKelvinToCelsius(d?.main.temp ?? 0)}°</p>
                  </div>
                ))}
              </div>
            </Container>
          </div>
          <div className=" flex gap-4">
            {/* left  */}
            <Container className="w-fit  justify-center flex-col px-4 items-center ">
              <p className=" capitalize text-center">
                {firstData?.weather[0].description}{" "}
              </p>
              <WeatherIcon
                iconName={getDayOrNightIcon(
                  firstData?.weather[0].icon ?? "",
                  firstData?.dt_txt ?? ""
                )}
              />
            </Container>
            <Container className="bg-yellow-300/80  px-6 gap-4 justify-between overflow-x-auto">
              <WeatherDetails
                visability={metersToKilometers(firstData?.visibility ?? 10000)}
                airPressure={`${firstData?.main.pressure} hPa`}
                humidity={`${firstData?.main.humidity}%`}
                sunrise={format(data?.city.sunrise ?? 1702949452, "H:mm")}
                // sunrise={}
                sunset={format(data?.city.sunset ?? 1702517657, "H:mm")}
                windSpeed={convertWindSpeed(firstData?.wind.speed ?? 1.64)}
              />
            </Container>
            {/* right  */}
          </div>
        </section>
        {/*7 todays data */}
        <section className="flex w-full flex-col gap-4  ">
          <p className="text-2xl">Forcast (7 days)</p>
          <ForecastWeatherDetail />
        </section>
      </main>
    </div>
  );
}
