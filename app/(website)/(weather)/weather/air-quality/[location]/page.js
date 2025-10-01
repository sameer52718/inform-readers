import { getAirQuality, getAQICategory, getCurrentWeather } from "@/lib/weather";
import LocationHeader from "@/components/weather/LocationHeader";
import Navigation from "@/components/weather/Navigation";
import DataTable from "@/components/weather/DataTable";
import AlertBanner from "@/components/weather/AlertBanner";
import { notFound } from "next/navigation";

export const revalidate = 600;

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

export default async function AirQualityPage({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const data = await getAirQuality(location);
    const aq = data.current.air_quality;

    if (!aq) {
      return (
        <div className="min-h-screen bg-gray-100">
          <LocationHeader location={data.location.name} currentPage="weather/air-quality" />
          <Navigation location={location} />
          <div className="max-w-6xl mx-auto p-4">
            <AlertBanner type="info" message="Air quality data is not available for this location." />
          </div>
        </div>
      );
    }

    const aqiValue = Math.round(aq["us-epa-index"]);
    const aqiCategory = getAQICategory(aqiValue);

    return (
      <div className="min-h-screen bg-gray-100">
        <LocationHeader location={data.location.name} currentPage="weather/air-quality" />
        <Navigation location={location} />

        <div className="max-w-6xl mx-auto p-4 space-y-6">
          <div>
            <h2 className="text-xl font-medium text-gray-900">Air Quality Index</h2>
            <p className="text-sm text-gray-600 mt-1">Current air quality conditions and pollutant levels</p>
          </div>

          <AQIOverview aqiValue={aqiValue} aqiCategory={aqiCategory} />
          <PollutantBreakdown aq={aq} />
          <HealthRecommendations aqiValue={aqiValue} />
        </div>
      </div>
    );
  } catch (error) {
    notFound();
  }
}

function AQIOverview({ aqiValue, aqiCategory }) {
  return (
    <div className="bg-white border border-gray-300 rounded-sm p-6">
      <div className="text-center mb-4">
        <div className="text-5xl font-bold text-gray-900 mb-2">{aqiValue}</div>
        <div className={`inline-block px-3 py-1 rounded-sm text-sm font-medium ${aqiCategory.color}`}>
          {aqiCategory.level}
        </div>
      </div>

      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-900 mb-2">Air Quality Scale</h3>
        <AQIScale currentValue={aqiValue} />
      </div>
    </div>
  );
}

function AQIScale({ currentValue }) {
  const ranges = [
    { min: 0, max: 50, color: "bg-green-500", label: "Good" },
    { min: 51, max: 100, color: "bg-yellow-500", label: "Moderate" },
    { min: 101, max: 150, color: "bg-orange-500", label: "Unhealthy for Sensitive Groups" },
    { min: 151, max: 200, color: "bg-red-500", label: "Unhealthy" },
    { min: 201, max: 300, color: "bg-purple-600", label: "Very Unhealthy" },
    { min: 301, max: 500, color: "bg-red-900", label: "Hazardous" },
  ];

  return (
    <div className="space-y-2">
      <div className="flex rounded-sm overflow-hidden h-6">
        {ranges.map((range, index) => (
          <div key={index} className={`flex-1 ${range.color} relative`}>
            {currentValue >= range.min && currentValue <= range.max && (
              <div
                className="absolute top-0 w-1 bg-black h-full"
                style={{ left: `${((currentValue - range.min) / (range.max - range.min)) * 100}%` }}
              />
            )}
          </div>
        ))}
      </div>
      <div className="grid grid-cols-6 text-xs text-gray-600 text-center">
        {ranges.map((range, index) => (
          <div key={index}>
            <div className="font-medium">
              {range.min}-{range.max}
            </div>
            <div>{range.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function PollutantBreakdown({ aq }) {
  const pollutants = [
    { name: "Carbon Monoxide (CO)", value: aq.co?.toFixed(2), unit: "μg/m³" },
    { name: "Nitrogen Dioxide (NO2)", value: aq.no2?.toFixed(2), unit: "μg/m³" },
    { name: "Ozone (O3)", value: aq.o3?.toFixed(2), unit: "μg/m³" },
    { name: "Sulfur Dioxide (SO2)", value: aq.so2?.toFixed(2), unit: "μg/m³" },
    { name: "PM2.5", value: aq.pm2_5?.toFixed(1), unit: "μg/m³" },
    { name: "PM10", value: aq.pm10?.toFixed(1), unit: "μg/m³" },
  ];

  const headers = ["Pollutant", "Current Level", "Health Impact"];
  const rows = pollutants
    .filter((p) => p.value && p.value !== "0.00")
    .map((pollutant) => [
      pollutant.name,
      `${pollutant.value} ${pollutant.unit}`,
      getPollutantImpact(pollutant.name, parseFloat(pollutant.value)),
    ]);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Pollutant Levels</h3>
      <DataTable headers={headers} rows={rows} />
    </div>
  );
}

function getPollutantImpact(name, value) {
  if (name.includes("PM2.5")) {
    if (value <= 12) return <span className="text-green-700">Low</span>;
    if (value <= 35) return <span className="text-yellow-700">Moderate</span>;
    return <span className="text-red-700">High</span>;
  }
  if (name.includes("PM10")) {
    if (value <= 54) return <span className="text-green-700">Low</span>;
    if (value <= 154) return <span className="text-yellow-700">Moderate</span>;
    return <span className="text-red-700">High</span>;
  }
  if (name.includes("Ozone")) {
    if (value <= 108) return <span className="text-green-700">Low</span>;
    if (value <= 180) return <span className="text-yellow-700">Moderate</span>;
    return <span className="text-red-700">High</span>;
  }
  return <span className="text-gray-700">Variable</span>;
}

function HealthRecommendations({ aqiValue }) {
  const getRecommendations = (aqi) => {
    if (aqi <= 50)
      return {
        title: "Good Air Quality",
        color: "success",
        recommendations: [
          "Air quality is excellent for outdoor activities",
          "No health precautions necessary",
          "Enjoy outdoor exercise and activities",
        ],
      };
    if (aqi <= 100)
      return {
        title: "Moderate Air Quality",
        color: "warning",
        recommendations: [
          "Air quality is acceptable for most people",
          "Sensitive individuals may experience minor issues",
          "Consider reducing prolonged outdoor exertion",
        ],
      };
    if (aqi <= 150)
      return {
        title: "Unhealthy for Sensitive Groups",
        color: "warning",
        recommendations: [
          "Children, elderly, and people with heart/lung conditions should reduce outdoor activities",
          "Everyone else can continue normal outdoor activities",
          "Consider moving exercise indoors",
        ],
      };
    return {
      title: "Unhealthy Air Quality",
      color: "error",
      recommendations: [
        "Everyone should reduce prolonged outdoor activities",
        "Keep windows closed and use air filtration",
        "Sensitive groups should avoid outdoor activities entirely",
      ],
    };
  };

  const rec = getRecommendations(aqiValue);

  return (
    <div>
      <h3 className="text-lg font-medium text-gray-900 mb-3">Health Recommendations</h3>
      <AlertBanner
        type={rec.color}
        title={rec.title}
        message={
          <ul className="mt-2 space-y-1">
            {rec.recommendations.map((item, index) => (
              <li key={index} className="text-sm">
                • {item}
              </li>
            ))}
          </ul>
        }
      />
    </div>
  );
}
