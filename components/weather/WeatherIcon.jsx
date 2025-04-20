"use client";

import {
  Cloud,
  CloudDrizzle,
  CloudFog,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  SunDim,
  Umbrella,
  Wind,
  MoonStar,
} from "lucide-react";

export default function WeatherIcon({ condition, className = "", size = 24, isDay = true }) {
  const getIcon = () => {
    const lowerCondition = condition.toLowerCase();

    if (lowerCondition.includes("thunder")) {
      return <CloudLightning size={size} className={className} />;
    } else if (lowerCondition.includes("drizzle")) {
      return <CloudDrizzle size={size} className={className} />;
    } else if (lowerCondition.includes("rain") || lowerCondition.includes("shower")) {
      return <CloudRain size={size} className={className} />;
    } else if (
      lowerCondition.includes("snow") ||
      lowerCondition.includes("sleet") ||
      lowerCondition.includes("ice")
    ) {
      return <CloudSnow size={size} className={className} />;
    } else if (lowerCondition.includes("fog") || lowerCondition.includes("mist")) {
      return <CloudFog size={size} className={className} />;
    } else if (lowerCondition.includes("overcast") || lowerCondition.includes("cloudy")) {
      return <Cloud size={size} className={className} />;
    } else if (lowerCondition.includes("partly cloudy")) {
      return <SunDim size={size} className={className} />;
    } else if (lowerCondition.includes("clear") && !isDay) {
      return <MoonStar size={size} className={className} />;
    } else if (lowerCondition.includes("sunny") || lowerCondition.includes("clear")) {
      return <Sun size={size} className={className} />;
    } else if (lowerCondition.includes("wind")) {
      return <Wind size={size} className={className} />;
    } else {
      return <Sun size={size} className={className} />;
    }
  };

  return getIcon();
}
