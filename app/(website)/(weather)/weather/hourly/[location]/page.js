import { getForecast, formatConditionIcon } from "@/lib/weather";
import LocationHeader from "@/components/weather/LocationHeader";
import Navigation from "@/components/weather/Navigation";
import DataTable from "@/components/weather/DataTable";
import { notFound } from "next/navigation";

export const revalidate = 300;

export async function generateMetadata({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const forecast = await getForecast(location, 1);
    const city = forecast?.location?.name ?? location;
    const country = forecast?.location?.country ?? "";

    return {
      title: `24-Hour Weather Forecast in ${city}${country ? `, ${country}` : ""} | Inform Readers`,
      description: `View detailed hourly weather forecast for ${city}${country ? `, ${country}` : ""} — including temperature, feels like, wind, humidity, and chance of rain.`,
      openGraph: {
        title: `Hourly Weather in ${city}`,
        description: `Plan ahead with a full 24-hour weather outlook for ${city}${country ? `, ${country}` : ""}.`,
        type: "website",
      },
    };
  } catch (error) {
    return {
      title: "Hourly Weather Forecast | Inform Readers",
      description:
        "Get the next 24 hours of temperature, rain chance, humidity, and wind conditions for any city worldwide.",
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
      `${Math.round(hour.temp_f)}°F`,
      `${Math.round(hour.feelslike_f)}°F`,
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
