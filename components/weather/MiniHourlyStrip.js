import { formatConditionIcon } from "@/lib/weather";

export default function MiniHourlyStrip({ hours, tempUnit = "F" }) {
  const getTemp = (hour) => {
    return Math.round(hour.temp_c);
  };

  const formatHour = (timeStr) => {
    const hour = new Date(timeStr).getHours();
    return hour === 0 ? "12 AM" : hour <= 12 ? `${hour} AM` : `${hour - 12} PM`;
  };

  return (
    <div className="bg-white border border-gray-300 rounded-sm p-3">
      <h3 className="text-sm font-medium text-gray-700 mb-2">Hourly Forecast</h3>
      <div className="flex gap-4 overflow-x-auto">
        {hours.slice(0, 12).map((hour, index) => (
          <div key={index} className="flex-shrink-0 text-center min-w-16">
            <div className="text-xs text-gray-600 mb-1">{formatHour(hour.time)}</div>
            <img
              src={formatConditionIcon(hour.condition.icon)}
              alt={hour.condition.text}
              className="w-8 h-8 mx-auto mb-1"
            />
            <div className="text-sm font-medium text-gray-900">{getTemp(hour)}°</div>
            <div className="text-xs text-gray-500">{Math.round(hour.chance_of_rain)}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}
