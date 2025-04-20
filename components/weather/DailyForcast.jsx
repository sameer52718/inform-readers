"use client";

import WeatherIcon from "./WeatherIcon";

export default function DailyForecast({ forecast, textColor }) {
  return (
    <div className="mt-6">
      <h3 className={`text-xl font-semibold mb-4 ${textColor}`}>5-Day Forecast</h3>
      <div className="space-y-3">
        {forecast.map((day, index) => {
          const date = new Date(day.date);
          const isToday = index === 0;
          const formattedDate = date.toLocaleDateString("en-US", {
            weekday: "long",
            month: "short",
            day: "numeric",
          });

          return (
            <div
              key={index}
              className={`flex items-center justify-between p-3 rounded-lg ${
                isToday ? "bg-slate-200" : "bg-slate-100"
              } backdrop-blur-md transition-all hover:bg-white/30`}
            >
              <div className="flex items-center">
                <WeatherIcon condition={day.day.condition.text} size={28} className={textColor} />
                <div className="ml-4">
                  <p className={`font-semibold ${textColor}`}>{isToday ? "Today" : formattedDate}</p>
                  <p className={`text-sm ${textColor} opacity-80`}>{day.day.condition.text}</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                {day.day.daily_chance_of_rain > 0 && (
                  <div className="flex items-center text-sm text-blue-500 font-medium">
                    <span>{day.day.daily_chance_of_rain}%</span>
                  </div>
                )}
                <div className="flex items-center space-x-2">
                  <span className={`font-bold ${textColor}`}>{Math.round(day.day.maxtemp_c)}°</span>
                  <span className={`${textColor} opacity-60`}>{Math.round(day.day.mintemp_c)}°</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
