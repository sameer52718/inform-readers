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

const faqs = {
  Hot: [
    {
      q: "What should I wear during hot weather?",
      a: "Light, breathable fabrics like cotton or linen are best.",
    },
    {
      q: "How can I stay safe during extremely high temperatures?",
      a: "Drink plenty of water, avoid direct sunlight, and rest in shaded areas.",
    },
    {
      q: "Is it safe to exercise in hot weather?",
      a: "Yes, but only in early morning or evening. Always stay hydrated.",
    },
    {
      q: "Can hot weather cause health problems?",
      a: "Yes, heatstroke, dehydration, and sunburn are common risks.",
    },
  ],
  Cold: [
    {
      q: "What clothes are best for cold weather?",
      a: "Layered clothing with wool or fleece works best. Don’t forget gloves and hats.",
    },
    {
      q: "How can I protect myself from extreme cold?",
      a: "Stay indoors during cold waves, use proper heating, and cover exposed skin.",
    },
    {
      q: "Is it safe to drive during snowy or icy conditions?",
      a: "Driving can be dangerous. Use winter tires and drive cautiously.",
    },
    {
      q: "Can cold weather make me sick?",
      a: "Cold itself doesn’t cause illness, but it weakens immunity, making infections more likely.",
    },
  ],
  Moderate: [
    {
      q: "What activities are best during moderate weather?",
      a: "Outdoor sports, picnics, and traveling are great options.",
    },
    {
      q: "Do I need special clothing for moderate weather?",
      a: "Comfortable casual wear works fine. Carry a light jacket just in case.",
    },
    {
      q: "Is moderate weather good for health?",
      a: "Yes, it usually reduces stress and improves well-being.",
    },
    {
      q: "Should I still check the forecast in moderate weather?",
      a: "Yes, because conditions can change suddenly.",
    },
  ],
};

const introTemplates = [
  (city, country) =>
    `Welcome to the live weather update for ${city}${
      country ? `, ${country}` : ""
    }. Here you can find today’s temperature, humidity, wind speed, and accurate weather conditions. Stay prepared with the latest hourly and weekly forecasts for ${city}.`,
  (city, country) =>
    `Planning your day in ${city}${
      country ? `, ${country}` : ""
    }? Check real-time weather conditions including temperature, rainfall chances, and climate details. Get both today’s forecast and a 7-day outlook for ${city}.`,
  (city, country) =>
    `The latest weather in ${city}${
      country ? `, ${country}` : ""
    } is available here. Stay informed about today’s temperature, climate changes, and upcoming forecasts. Whether it’s hot, cold, or moderate, we bring accurate updates for ${city}.`,
  (city, country) =>
    `Looking for today’s weather in ${city}${
      country ? `, ${country}` : ""
    }? Find detailed updates including current temperature, air quality, wind speed, and sunrise/sunset timings. Stay ahead with our trusted forecast for ${city}.`,
  (city, country) =>
    `Weather conditions in ${city}${
      country ? `, ${country}` : ""
    } are updated live. View current temperature, hourly forecast, and weekly climate reports. Stay safe and plan your day better with accurate updates for ${city}.`,
];

function WeatherFAQs({ temp }) {
  let weatherType = "Moderate";
  if (temp >= 30) weatherType = "Hot";
  else if (temp <= 15) weatherType = "Cold";

  const selectedFaqs = faqs[weatherType];

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">FAQs for {weatherType} Weather</h3>
      <div className="space-y-3">
        {selectedFaqs.map((item, index) => (
          <div key={index}>
            <p className="font-medium text-gray-800">Q: {item.q}</p>
            <p className="text-gray-600">A: {item.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default async function TodayPage({ params }) {
  const location = decodeURIComponent(params.location);

  try {
    const [current, forecast] = await Promise.all([getCurrentWeather(location), getForecast(location, 1)]);

    const today = forecast.forecast.forecastday[0];
    const alerts = forecast.alerts?.alert || [];

    const randomIntro = introTemplates[Math.floor(Math.random() * introTemplates.length)](
      current.location.name,
      current.location.country
    );

    return (
      <div className="min-h-screen bg-gray-100">
        <LocationHeader location={current.location.name} currentPage="weather/today" />
        <Navigation location={location} />

        <div className="max-w-6xl mx-auto p-4 space-y-4">
          <p className="text-gray-700 text-base leading-relaxed">{randomIntro}</p>
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
            <div className="col-span-2">
              <WeatherFAQs temp={current.current.temp_c} />
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
        {/* <TempToggle /> */}
      </div>

      <div className="flex items-center gap-4">
        <img
          src={formatConditionIcon(current.current.condition.icon)}
          alt={current.current.condition.text}
          className="w-16 h-16"
        />
        <div>
          <div className="text-4xl font-bold text-gray-900">{Math.round(current.current.temp_c)}°C</div>
          <div className="text-sm text-gray-600">{current.current.condition.text}</div>
          <div className="text-sm text-gray-600">Feels like {Math.round(current.current.feelslike_C)}°C</div>
        </div>
      </div>
    </div>
  );
}

function TodayDetails({ today }) {
  const details = [
    ["High / Low", `${Math.round(today.day.maxtemp_f)}°F / ${Math.round(today.day.mintemp_c)}°C`],
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
