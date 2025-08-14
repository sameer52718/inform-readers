import { getForecast, formatConditionIcon } from "@/lib/weather";
import LocationHeader from "@/components/weather/LocationHeader";
import Navigation from "@/components/weather/Navigation";
import DataTable from "@/components/weather/DataTable";
import { notFound } from "next/navigation";

export const revalidate = 900;

export default async function ThreeDayPage({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const forecast = await getForecast(location, 3);
    const days = forecast.forecast.forecastday;

    return (
      <div className="min-h-screen bg-gray-100">
        <LocationHeader location={forecast.location.name} currentPage="weather/3day" />
        <Navigation location={location} />

        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900">3-Day Forecast</h2>
            <p className="text-sm text-gray-600 mt-1">Detailed weather conditions for the next three days</p>
          </div>

          <DailyOverview days={days} />

          {days.map((day, index) => (
            <DayDetails key={day.date} day={day} isToday={index === 0} />
          ))}
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

function DailyOverview({ days }) {
  const headers = ["Day", "Condition", "High / Low", "Rain Chance", "Wind", "Humidity"];

  const rows = days.map((day, index) => [
    formatDayName(day.date, index === 0),
    <div className="flex items-center gap-2">
      <img
        src={formatConditionIcon(day.day.condition.icon)}
        alt={day.day.condition.text}
        className="w-8 h-8"
      />
      <span className="text-sm">{day.day.condition.text}</span>
    </div>,
    `${Math.round(day.day.maxtemp_f)}°F / ${Math.round(day.day.mintemp_f)}°F`,
    `${day.day.daily_chance_of_rain}%`,
    `${Math.round(day.day.maxwind_mph)} mph`,
    `${day.day.avghumidity}%`,
  ]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Overview</h3>
      <DataTable headers={headers} rows={rows} />
    </div>
  );
}

function DayDetails({ day, isToday }) {
  const dayPeriods = [
    { name: "Morning (6 AM)", hour: day.hour[6] },
    { name: "Afternoon (12 PM)", hour: day.hour[12] },
    { name: "Evening (6 PM)", hour: day.hour[18] },
    { name: "Night (12 AM)", hour: day.hour[0] },
  ];

  const headers = ["Time Period", "Condition", "Temperature", "Feels Like", "Wind", "Humidity"];

  const rows = dayPeriods.map(({ name, hour }) => [
    name,
    <div className="flex items-center gap-2">
      <img src={formatConditionIcon(hour.condition.icon)} alt={hour.condition.text} className="w-6 h-6" />
      <span className="text-sm">{hour.condition.text}</span>
    </div>,
    `${Math.round(hour.temp_f)}°F`,
    `${Math.round(hour.feelslike_f)}°F`,
    `${Math.round(hour.wind_mph)} mph ${hour.wind_dir}`,
    `${hour.humidity}%`,
  ]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">
        {formatDayName(day.date, isToday)} - Detailed Breakdown
      </h3>
      <DataTable headers={headers} rows={rows} />

      <div className="mt-4 bg-white border border-gray-300 rounded-sm p-4">
        <h4 className="font-medium text-gray-900 mb-2">Additional Details</h4>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">UV Index</span>
              <span className="font-medium">{day.day.uv}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Visibility</span>
              <span className="font-medium">{day.day.avgvis_miles} miles</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sunrise</span>
              <span className="font-medium">{day.astro.sunrise}</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between">
              <span className="text-gray-600">Total Precipitation</span>
              <span className="font-medium">{day.day.totalprecip_in}"</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Snow</span>
              <span className="font-medium">{day.day.totalsnow_cm || 0} cm</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Sunset</span>
              <span className="font-medium">{day.astro.sunset}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDayName(dateString, isToday) {
  if (isToday) return "Today";

  const date = new Date(dateString);
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);

  if (date.toDateString() === tomorrow.toDateString()) {
    return "Tomorrow";
  }

  return date.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
