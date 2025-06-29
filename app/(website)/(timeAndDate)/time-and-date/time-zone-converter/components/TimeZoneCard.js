import React from "react";
import { Trash2, Clock } from "lucide-react";
import { formatTime, formatDate } from "@/lib/timeUtils";

export const TimeZoneCard = ({ city, onRemove, isRemovable }) => {
  const timeOffset = city.offset >= 0 ? `+${city.offset}` : `${city.offset}`;
  const timeString = formatTime(city.currentTime);
  const dateString = formatDate(city.currentTime);

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 group-hover:text-red-600 transition-colors">
            {city.name}
          </h3>
          <p className="text-sm text-gray-500 mt-1">
            {city.country} • UTC{timeOffset}
          </p>
        </div>
        {isRemovable && (
          <button
            onClick={() => onRemove(city.id)}
            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all duration-200 opacity-0 group-hover:opacity-100"
            aria-label={`Remove ${city.name}`}
          >
            <Trash2 size={16} />
          </button>
        )}
      </div>

      <div className="space-y-2">
        <div className="flex items-center space-x-3">
          <Clock size={20} className="text-red-500" />
          <div>
            <p className="text-2xl font-bold text-gray-900">{timeString}</p>
            <p className="text-sm text-gray-600">{dateString}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
