export const mockWeatherData = {
  location: {
    name: "New York",
    country: "United States",
    lat: 40.71,
    lon: -74.01,
  },
  current: {
    temp_c: 24,
    temp_f: 75.2,
    condition: {
      text: "Partly cloudy",
      icon: "partly-cloudy",
      code: 1003,
    },
    wind_kph: 15.1,
    wind_dir: "NW",
    humidity: 65,
    feelslike_c: 25.2,
    feelslike_f: 77.4,
    uv: 5,
    pressure_mb: 1012,
    vis_km: 10,
    last_updated: "2025-04-15 14:30",
  },
  forecast: [
    {
      date: "2025-04-15",
      day: {
        maxtemp_c: 27,
        mintemp_c: 18,
        maxtemp_f: 80.6,
        mintemp_f: 64.4,
        condition: {
          text: "Partly cloudy",
          icon: "partly-cloudy",
          code: 1003,
        },
        daily_chance_of_rain: 10,
      },
      hour: Array(24)
        .fill(null)
        .map((_, i) => ({
          time: `2025-04-15 ${i.toString().padStart(2, "0")}:00`,
          temp_c: 18 + Math.sin((i - 6) * 0.4) * 9,
          temp_f: 64.4 + Math.sin((i - 6) * 0.4) * 16.2,
          condition: {
            text: i >= 6 && i <= 18 ? "Partly cloudy" : "Clear",
            icon: i >= 6 && i <= 18 ? "partly-cloudy" : "clear-night",
            code: i >= 6 && i <= 18 ? 1003 : 1000,
          },
          chance_of_rain: i >= 14 && i <= 16 ? 25 : 0,
        })),
    },
    {
      date: "2025-04-16",
      day: {
        maxtemp_c: 28,
        mintemp_c: 19,
        maxtemp_f: 82.4,
        mintemp_f: 66.2,
        condition: {
          text: "Sunny",
          icon: "sunny",
          code: 1000,
        },
        daily_chance_of_rain: 0,
      },
      hour: [],
    },
    {
      date: "2025-04-17",
      day: {
        maxtemp_c: 25,
        mintemp_c: 18,
        maxtemp_f: 77,
        mintemp_f: 64.4,
        condition: {
          text: "Patchy rain possible",
          icon: "patchy-rain",
          code: 1063,
        },
        daily_chance_of_rain: 60,
      },
      hour: [],
    },
    {
      date: "2025-04-18",
      day: {
        maxtemp_c: 21,
        mintemp_c: 16,
        maxtemp_f: 69.8,
        mintemp_f: 60.8,
        condition: {
          text: "Light rain",
          icon: "light-rain",
          code: 1183,
        },
        daily_chance_of_rain: 80,
      },
      hour: [],
    },
    {
      date: "2025-04-19",
      day: {
        maxtemp_c: 24,
        mintemp_c: 17,
        maxtemp_f: 75.2,
        mintemp_f: 62.6,
        condition: {
          text: "Partly cloudy",
          icon: "partly-cloudy",
          code: 1003,
        },
        daily_chance_of_rain: 20,
      },
      hour: [],
    },
  ],
};

export const savedLocations = [
  { id: "1", name: "New York", country: "United States" },
  { id: "2", name: "London", country: "United Kingdom" },
  { id: "3", name: "Tokyo", country: "Japan" },
];

export function getBackgroundColor(condition, isDay) {
  if (!isDay) return "bg-gradient-to-br from-indigo-900 via-blue-900 to-slate-900";

  if (condition.includes("rain") || condition.includes("drizzle")) {
    return "bg-gradient-to-br from-slate-700 via-blue-700 to-slate-600";
  } else if (condition.includes("cloud")) {
    return "bg-gradient-to-br from-blue-400 via-blue-300 to-blue-100";
  } else if (condition.includes("snow")) {
    return "bg-gradient-to-br from-slate-200 via-slate-100 to-white";
  } else if (condition.includes("fog") || condition.includes("mist")) {
    return "bg-gradient-to-br from-slate-400 via-slate-300 to-slate-200";
  } else if (condition.includes("thunder") || condition.includes("storm")) {
    return "bg-gradient-to-br from-slate-800 via-slate-700 to-slate-600";
  } else {
    // Sunny or clear
    return "bg-gradient-to-br from-blue-500 via-blue-300 to-blue-100";
  }
}

export function getTextColor(condition, isDay) {
  if (!isDay) return "text-white";

  if (
    condition.includes("rain") ||
    condition.includes("drizzle") ||
    condition.includes("thunder") ||
    condition.includes("storm")
  ) {
    return "text-white";
  } else if (
    condition.includes("snow") ||
    condition.includes("clear") ||
    condition.includes("sunny") ||
    condition.includes("cloud") ||
    condition.includes("fog") ||
    condition.includes("mist")
  ) {
    return "text-slate-800";
  } else {
    return "text-slate-800";
  }
}
