"use client";

import { useState, useEffect } from "react";
import WeatherIcon from "./WeatherIcon";

export default function HourlyForecast({ forecast }) {
  const [currentHour, setCurrentHour] = useState(0);

  useEffect(() => {
    // Set current hour based on current time
    const now = new Date();
    setCurrentHour(now.getHours());
  }, []);

  // Get only the next 24 hours from current hour
  const hourlyData = forecast
    .filter((_, index) => {
      const hourFromTime = parseInt(
        new Date(_.time).toLocaleTimeString("en-US", { hour: "2-digit", hour12: false })
      );
      return hourFromTime >= currentHour;
    })
    .slice(0, 24);

  return (
    <div className="mt-6 mb-8">
      <h3 className="text-xl font-semibold mb-4">Hourly Forecast</h3>
      <div className="overflow-x-auto pb-4">
        <div className="flex space-x-4 min-w-max">
          {hourlyData.map((hour, index) => {
            const time = new Date(hour.time);
            const isDay = time.getHours() >= 6 && time.getHours() < 18;

            return (
              <div
                key={index}
                className="flex flex-col items-center p-3 rounded-lg bg-white/10 backdrop-blur-md transition-transform hover:scale-105"
              >
                <span className="text-sm font-medium">
                  {time.toLocaleTimeString("en-US", { hour: "2-digit", hour12: true })}
                </span>
                <div className="my-2">
                  <WeatherIcon
                    condition={hour.condition.text}
                    size={28}
                    className="text-slate-700"
                    isDay={isDay}
                  />
                </div>
                <span className="text-lg font-bold">{Math.round(hour.temp_c)}°</span>
                {hour.chance_of_rain > 0 && (
                  <div className="flex items-center mt-1 text-xs text-blue-600 font-medium">
                    <span>{hour.chance_of_rain}%</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
