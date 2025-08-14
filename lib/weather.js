const BASE_URL = "https://api.weatherapi.com/v1";

export async function getCurrentWeather(location) {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(
        location
      )}&aqi=yes`,
      { next: { revalidate: 300 } } // 5 minute ISR
    );

    if (!response.ok) {
      throw new Error("Failed to fetch current weather");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching current weather:", error);
    throw error;
  }
}

export async function getForecast(location, days = 3) {
  try {
    const response = await fetch(
      `${BASE_URL}/forecast.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(
        location
      )}&days=${days}&aqi=yes&alerts=yes`,
      { next: { revalidate: 900 } } // 15 minute ISR
    );

    if (!response.ok) {
      throw new Error("Failed to fetch forecast");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching forecast:", error);
    throw error;
  }
}

export async function getAirQuality(location) {
  try {
    const response = await fetch(
      `${BASE_URL}/current.json?key=${process.env.NEXT_PUBLIC_WEATHER_API_KEY}&q=${encodeURIComponent(
        location
      )}&aqi=yes`,
      { next: { revalidate: 600 } } // 10 minute ISR
    );

    if (!response.ok) {
      throw new Error("Failed to fetch air quality");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching air quality:", error);
    throw error;
  }
}

export function formatConditionIcon(iconUrl) {
  return iconUrl?.startsWith("//") ? `https:${iconUrl}` : iconUrl;
}

export function getAQICategory(aqi) {
  if (aqi <= 50) return { level: "Good", color: "text-green-700 bg-green-100" };
  if (aqi <= 100) return { level: "Moderate", color: "text-yellow-700 bg-yellow-100" };
  if (aqi <= 150) return { level: "Unhealthy for Sensitive Groups", color: "text-orange-700 bg-orange-100" };
  if (aqi <= 200) return { level: "Unhealthy", color: "text-red-700 bg-red-100" };
  if (aqi <= 300) return { level: "Very Unhealthy", color: "text-purple-700 bg-purple-100" };
  return { level: "Hazardous", color: "text-gray-100 bg-red-900" };
}
