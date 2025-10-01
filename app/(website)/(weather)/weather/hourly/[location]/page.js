import { getForecast, formatConditionIcon, getCurrentWeather } from "@/lib/weather";
import LocationHeader from "@/components/weather/LocationHeader";
import Navigation from "@/components/weather/Navigation";
import DataTable from "@/components/weather/DataTable";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const location = decodeURIComponent(params.location);

  const metaTemplates = [
    {
      title: (city, country) =>
        `Weather in ${city}${country ? `, ${country}` : ""} | Today’s Forecast & Temperature`,
      description: (city, country) =>
        `Get the latest weather updates for ${city}${
          country ? `, ${country}` : ""
        }. Check today’s temperature, conditions, and 7-day forecast tailored for ${city}.`,
    },
    {
      title: (city, country) =>
        `${city} Weather | Live Forecast & Climate Updates${country ? ` in ${country}` : ""}`,
      description: (city, country) =>
        `Stay informed with real-time ${city} weather updates${
          country ? ` in ${country}` : ""
        }. Find temperature, humidity, wind speed, and accurate forecasts.`,
    },
    {
      title: (city, country) =>
        `${city}${country ? `, ${country}` : ""} Weather Today | Accurate Weather Forecast`,
      description: (city, country) =>
        `See live weather in ${city}${
          country ? `, ${country}` : ""
        }. Get current conditions, hourly updates, and tomorrow’s weather forecast for ${city}.`,
    },
    {
      title: (city, country) => `Current Weather in ${city}${country ? `, ${country}` : ""} | 7-Day Forecast`,
      description: (city, country) =>
        `Discover ${city}’s latest weather conditions${
          country ? ` in ${country}` : ""
        }. Check temperature, sunrise, sunset, and 7-day detailed weather forecast.`,
    },
    {
      title: (city, country) =>
        `${city} Weather Updates | Real-Time Forecast${country ? ` for ${country}` : ""}`,
      description: (city, country) =>
        `Get up-to-date weather reports for ${city}${
          country ? `, ${country}` : ""
        }. View daily temperature, weather alerts, and accurate forecasts instantly.`,
    },
    {
      title: (city, country) =>
        `${city}${country ? `, ${country}` : ""} Climate & Weather | Live Updates Today`,
      description: (city, country) =>
        `Check ${city}${
          country ? `, ${country}` : ""
        } weather conditions today. Find real-time temperature, humidity, rain chances, and weather warnings.`,
    },
    {
      title: (city, country) =>
        `Weather Forecast ${city}${country ? `, ${country}` : ""} | Hourly & Weekly Updates`,
      description: (city, country) =>
        `Accurate weather forecast for ${city}${
          country ? `, ${country}` : ""
        }. Explore hourly weather, 7-day updates, and live climate conditions.`,
    },
    {
      title: (city, country) =>
        `${city} Temperature & Forecast | Weather${country ? ` in ${country}` : ""} Today`,
      description: (city, country) =>
        `Find out ${city}’s current temperature, weather forecast, and air conditions${
          country ? ` in ${country}` : ""
        }. Stay updated with daily weather alerts.`,
    },
    {
      title: (city, country) =>
        `Live Weather ${city}${country ? `, ${country}` : ""} | Today’s Conditions & Alerts`,
      description: (city, country) =>
        `Stay safe with live weather data for ${city}${
          country ? `, ${country}` : ""
        }. Get temperature, wind speed, rain chances, and weather alerts.`,
    },
    {
      title: (city, country) =>
        `${city}${country ? `, ${country}` : ""} Weather Information | Daily & Weekly Forecast`,
      description: (city, country) =>
        `Get comprehensive weather information for ${city}${
          country ? `, ${country}` : ""
        }. View today’s forecast, extended 7-day outlook, and climate updates.`,
    },
  ];

  try {
    const current = await getCurrentWeather(location);

    const city = current?.location?.name ?? location;
    const country = current?.location?.country ?? "";

    // 🎲 Pick random template
    const randomTemplate = metaTemplates[Math.floor(Math.random() * metaTemplates.length)];

    return {
      title: randomTemplate.title(city, country),
      description: randomTemplate.description(city, country),
      openGraph: {
        title: randomTemplate.title(city, country),
        description: randomTemplate.description(city, country),
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: `Weather Today | Inform Readers`,
      description: `Get live weather updates, hourly forecasts, and air quality information for any city.`,
    };
  }
}

export default async function HourlyPage({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const forecast = await getForecast(location, 2);
    const allHours = [...forecast.forecast.forecastday[0].hour, ...forecast.forecast.forecastday[1].hour];

    const currentHour = new Date().getHours();
    const todayHours = allHours.filter((_, index) => index >= currentHour);
    const next24Hours = todayHours.slice(0, 24);

    const headers = ["Time", "Condition", "Temp", "Feels Like", "Wind", "Humidity", "Rain Chance"];

    const rows = next24Hours.map((hour) => [
      formatTime(hour.time),
      <div className="flex items-center gap-2">
        <img src={formatConditionIcon(hour.condition.icon)} alt={hour.condition.text} className="w-6 h-6" />
        <span className="text-sm">{hour.condition.text}</span>
      </div>,
      `${Math.round(hour.temp_c)}°C`,
      `${Math.round(hour.feelslike_c)}°C`,
      `${Math.round(hour.wind_mph)} mph ${hour.wind_dir}`,
      `${hour.humidity}%`,
      `${hour.chance_of_rain}%`,
    ]);

    return (
      <div className="min-h-screen bg-gray-100">
        <LocationHeader location={forecast.location.name} currentPage="weather/hourly" />
        <Navigation location={location} />

        <div className="max-w-6xl mx-auto p-4">
          <div className="mb-4">
            <h2 className="text-xl font-medium text-gray-900">24-Hour Forecast</h2>
            <p className="text-sm text-gray-600 mt-1">
              Hourly conditions for the next 24 hours starting from now
            </p>
          </div>

          <DataTable headers={headers} rows={rows} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

function formatTime(timeString) {
  const date = new Date(timeString);
  const now = new Date();
  const isToday = date.toDateString() === now.toDateString();

  const timeStr = date.toLocaleTimeString("en-US", {
    hour: "numeric",
    hour12: true,
  });

  if (isToday && date.getHours() === now.getHours()) {
    return `${timeStr} (Now)`;
  }

  return `${isToday ? "Today" : "Tomorrow"} ${timeStr}`;
}
