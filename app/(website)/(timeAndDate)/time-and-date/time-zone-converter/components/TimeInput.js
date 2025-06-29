import React, { useState, useEffect } from "react";
import { Calendar, Clock } from "lucide-react";

export const TimeInput = ({ onTimeChange, currentTime }) => {
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [useCurrentTime, setUseCurrentTime] = useState(true);

  useEffect(() => {
    const now = new Date();
    setSelectedDate(now.toISOString().split("T")[0]);
    setSelectedTime(now.toTimeString().slice(0, 5));
  }, []);

  useEffect(() => {
    if (!useCurrentTime && selectedDate && selectedTime) {
      const newDate = new Date(`${selectedDate}T${selectedTime}`);
      onTimeChange(newDate);
    } else {
      onTimeChange(currentTime);
    }
  }, [selectedDate, selectedTime, useCurrentTime, currentTime, onTimeChange]);

  const handleCurrentTimeToggle = () => {
    setUseCurrentTime(!useCurrentTime);
    if (!useCurrentTime) {
      onTimeChange(currentTime);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-md border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Time Converter</h3>

      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="useCurrentTime"
            checked={useCurrentTime}
            onChange={handleCurrentTimeToggle}
            className="w-4 h-4 text-red-600 border-gray-300 rounded focus:ring-red-500"
          />
          <label htmlFor="useCurrentTime" className="text-sm font-medium text-gray-700">
            Use current time
          </label>
        </div>

        {!useCurrentTime && (
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Calendar size={16} className="inline mr-2" />
                Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Clock size={16} className="inline mr-2" />
                Time
              </label>
              <input
                type="time"
                value={selectedTime}
                onChange={(e) => setSelectedTime(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none"
              />
            </div>
          </div>
        )}

        <div className="pt-3 border-t border-gray-100">
          <p className="text-sm text-gray-600">
            {useCurrentTime
              ? "Showing current time across all zones"
              : "Showing converted time across all zones"}
          </p>
        </div>
      </div>
    </div>
  );
};
