import React from "react";
import Landing from "./components/Landing";

export const metadata = {
  title: "Weather Forecast | Live Weather Updates & Local Conditions",
  description:
    "Get accurate live weather forecasts, temperature updates, air quality index, and severe weather alerts for your city. Check hourly and 3-day forecasts.",
  keywords: [
    "weather forecast",
    "local weather",
    "today's weather",
    "hourly forecast",
    "air quality index",
    "weather alerts",
  ],
  openGraph: {
    title: "Weather Forecast & Live Updates",
    description:
      "Get real-time weather data, hourly forecasts, and air quality information for your location.",
    siteName: "Inform Readers",
    type: "website",
  },
};

const Page = () => {
  return <Landing />;
};

export default Page;
