"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation({ location }) {
  const pathname = usePathname();

  const getNavClass = (path) => {
    const isActive = pathname.includes(path);
    return `px-3 py-1 text-sm rounded-sm ${
      isActive ? "bg-red-600 text-white" : "text-gray-700 hover:bg-gray-100"
    }`;
  };

  if (!location) return null;

  const encodedLocation = encodeURIComponent(location);

  return (
    <div className="bg-white border-b border-gray-300 px-3 py-2">
      <div className="max-w-6xl mx-auto">
        <nav className="flex gap-1">
          <Link href={`/weather/today/${encodedLocation}`} className={getNavClass("today")}>
            Today
          </Link>
          <Link href={`/weather/hourly/${encodedLocation}`} className={getNavClass("hourly")}>
            Hourly
          </Link>
          <Link href={`/weather/3day/${encodedLocation}`} className={getNavClass("3day")}>
            3 Day
          </Link>
          <Link href={`/weather/air-quality/${encodedLocation}`} className={getNavClass("air-quality")}>
            Air Quality
          </Link>
        </nav>
      </div>
    </div>
  );
}
