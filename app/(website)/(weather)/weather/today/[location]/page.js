import { getCurrentWeather, getForecast, formatConditionIcon } from "@/lib/weather";
import LocationHeader from "@/components/weather/LocationHeader";
import Navigation from "@/components/weather/Navigation";
import TempToggle from "@/components/weather/TempToggle";
import MiniHourlyStrip from "@/components/weather/MiniHourlyStrip";
import AlertBanner from "@/components/weather/AlertBanner";
import { notFound } from "next/navigation";

export const revalidate = 300; // 5 minutes

export async function generateMetadata({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const current = await getCurrentWeather(location);

    const city = current?.location?.name ?? location;
    const country = current?.location?.country ?? "";

    return {
      title: `Today's Weather in ${city}${country ? `, ${country}` : ""} | Inform Readers`,
      description: `Live weather for ${city}${country ? `, ${country}` : ""}: ${current.current.condition.text}, ${Math.round(
        current.current.temp_f
      )}°F. Check hourly forecast, sunrise & sunset times, and air quality.`,
      openGraph: {
        title: `Weather Today in ${city}`,
        description: `Get real-time weather conditions, forecast, and air quality for ${city}.`,
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


export default async function TodayPage({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const [current, forecast] = await Promise.all([getCurrentWeather(location), getForecast(location, 1)]);

    const today = forecast.forecast.forecastday[0];
    const alerts = forecast.alerts?.alert || [];

    return (
      <div className="min-h-screen bg-gray-100">
        <LocationHeader location={current.location.name} currentPage="weather/today" />
        <Navigation location={location} />

        <div className="max-w-6xl mx-auto p-4 space-y-4">
          {alerts.length > 0 && (
            <div className="space-y-2">
              {alerts.map((alert, index) => (
                <AlertBanner key={index} type="warning" title={alert.event} message={alert.desc} />
              ))}
            </div>
          )}

          <div className="grid lg:grid-cols-3 gap-4">
            <div className="lg:col-span-2 space-y-4">
              <CurrentConditions current={current} />
              <MiniHourlyStrip hours={today.hour} />
              <TodayDetails today={today} />
            </div>

            <div className="space-y-4">
              <SunMoonTimes forecast={today} />
              <AirQualityPreview current={current} location={location} />
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

function CurrentConditions({ current }) {
  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-medium text-gray-900">Current Conditions</h2>
        <TempToggle />
      </div>

      <div className="flex items-center gap-4">
        <img
          src={formatConditionIcon(current.current.condition.icon)}
          alt={current.current.condition.text}
          className="w-16 h-16"
        />
        <div>
          <div className="text-4xl font-bold text-gray-900">{Math.round(current.current.temp_f)}°F</div>
          <div className="text-sm text-gray-600">{current.current.condition.text}</div>
          <div className="text-sm text-gray-600">Feels like {Math.round(current.current.feelslike_f)}°F</div>
        </div>
      </div>
    </div>
  );
}

function TodayDetails({ today }) {
  const details = [
    ["High / Low", `${Math.round(today.day.maxtemp_f)}°F / ${Math.round(today.day.mintemp_f)}°F`],
    ["Humidity", `${today.day.avghumidity}%`],
    ["Wind", `${Math.round(today.day.maxwind_mph)} mph`],
    ["Visibility", `${today.day.avgvis_miles} miles`],
    ["UV Index", today.day.uv],
    ["Rain Chance", `${today.day.daily_chance_of_rain}%`],
  ];

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Today's Details</h3>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 text-sm">
        {details.map(([label, value], index) => (
          <div key={index} className="flex justify-between">
            <span className="text-gray-600">{label}</span>
            <span className="font-medium text-gray-900">{value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function SunMoonTimes({ forecast }) {
  const astro = forecast.astro;

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Sun & Moon</h3>
      <div className="space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-gray-600">Sunrise</span>
          <span className="font-medium text-gray-900">{astro.sunrise}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Sunset</span>
          <span className="font-medium text-gray-900">{astro.sunset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Moonrise</span>
          <span className="font-medium text-gray-900">{astro.moonrise}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Moonset</span>
          <span className="font-medium text-gray-900">{astro.moonset}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Moon Phase</span>
          <span className="font-medium text-gray-900">{astro.moon_phase}</span>
        </div>
      </div>
    </div>
  );
}

function AirQualityPreview({ current, location }) {
  if (!current.current.air_quality) return null;

  const aqi = Math.round(current.current.air_quality["us-epa-index"]);
  const getAQILevel = (index) => {
    if (index <= 50) return { level: "Good", color: "text-green-700" };
    if (index <= 100) return { level: "Moderate", color: "text-yellow-700" };
    if (index <= 150) return { level: "Unhealthy for Sensitive", color: "text-orange-700" };
    return { level: "Unhealthy", color: "text-red-700" };
  };

  const aqiData = getAQILevel(aqi);

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Air Quality</h3>
      <div className="text-center mb-3">
        <div className="text-2xl font-bold text-gray-900">{aqi}</div>
        <div className={`text-sm font-medium ${aqiData.color}`}>{aqiData.level}</div>
      </div>
      <a
        href={`/weather/air-quality/${encodeURIComponent(location)}`}
        className="block w-full text-center px-3 py-2 text-sm bg-gray-100 text-gray-700 hover:bg-gray-200 rounded-sm"
      >
        View Details
      </a>
    </div>
  );
}
