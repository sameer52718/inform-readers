"use client";

import { useState, useEffect, useRef } from "react";
import { useParams } from "next/navigation";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import Clock from "react-clock";
import "react-clock/dist/Clock.css";
import { Loader2 } from "lucide-react";
import Holidays from "date-holidays";

const HolidayDetail = () => {
  const { code } = useParams();
  const [countryName, setCountryName] = useState("");
  const [events, setEvents] = useState([]);
  const [year, setYear] = useState(new Date().getFullYear());
  const [isLoading, setIsLoading] = useState(true);
  const [selectedHoliday, setSelectedHoliday] = useState(null);
  const [clockColor, setClockColor] = useState("#4f46e5"); // Default indigo
  const [clockFormat, setClockFormat] = useState("24h"); // 12h or 24h
  const [countdownStyle, setCountdownStyle] = useState("modern"); // modern or minimal
  const [currentTime, setCurrentTime] = useState(new Date());
  const clockRef = useRef(null);
  const calendarRef = useRef(null);
  const countdownRef = useRef(null);

  // Initialize date-holidays
  const hd = new Holidays();

  useEffect(() => {
    if (!code) return;

    setIsLoading(true);

    // Initialize holidays for the selected country
    hd.init(code);

    // Get country name
    const countries = hd.getCountries();
    setCountryName(countries[code] || "Unknown Country");

    // Get holidays for the selected year
    const holidays = hd.getHolidays(year).map((holiday) => ({
      title: holiday.name,
      date: holiday.date.split(" ")[0], // Extract date part (YYYY-MM-DD)
      className: getHolidayClass(holiday.type),
      extendedProps: {
        type: holiday.type,
        note: holiday.note || "",
      },
    }));

    setEvents(holidays);
    setIsLoading(false);
  }, [code, year]);

  // Update clock time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Function to determine event styling based on holiday type
  const getHolidayClass = (type) => {
    switch (type.toLowerCase()) {
      case "public":
        return "text-red-600 font-semibold";
      case "religious":
        return "text-blue-600 font-semibold";
      case "observance":
        return "text-green-600";
      default:
        return "text-gray-600";
    }
  };

  // Handle year change
  const handleYearChange = (e) => {
    setYear(parseInt(e.target.value));
    setSelectedHoliday(null); // Reset countdown when year changes
  };

  // Handle holiday selection for countdown
  const handleHolidaySelect = (e) => {
    const selectedDate = e.target.value;
    const holiday = events.find((event) => event.date === selectedDate);
    setSelectedHoliday(holiday || null);
  };

  // Handle clock color change
  const handleClockColorChange = (e) => {
    setClockColor(e.target.value);
  };

  // Handle clock format change
  const handleClockFormatChange = (e) => {
    setClockFormat(e.target.value);
  };

  // Handle countdown style change
  const handleCountdownStyleChange = (e) => {
    setCountdownStyle(e.target.value);
  };

  // Generate embed code for widgets
  const generateEmbedCode = (widgetType) => {
    if (widgetType === "clock") {
      return `<iframe src="/api/widgets/clock?country=${code}&color=${encodeURIComponent(
        clockColor
      )}&format=${clockFormat}" width="200" height="200" frameborder="0"></iframe>`;
    } else if (widgetType === "calendar") {
      return `<iframe src="/api/widgets/calendar?country=${code}&year=${year}" width="100%" height="600" frameborder="0"></iframe>`;
    } else if (widgetType === "countdown" && selectedHoliday) {
      return `<iframe src="/api/widgets/countdown?country=${code}&date=${
        selectedHoliday.date
      }&name=${encodeURIComponent(
        selectedHoliday.title
      )}&style=${countdownStyle}" width="300" height="100" frameborder="0"></iframe>`;
    }
    return "";
  };

  // Generate year options (current year ± 5 years)
  const yearOptions = Array.from({ length: 11 }, (_, i) => year - 5 + i);

  // Countdown timer logic
  const CountdownTimer = ({ targetDate, holidayName }) => {
    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

    function calculateTimeLeft() {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;
      if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 };

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      return { days, hours, minutes, seconds };
    }

    useEffect(() => {
      const timer = setInterval(() => {
        setTimeLeft(calculateTimeLeft());
      }, 1000);
      return () => clearInterval(timer);
    }, [targetDate]);

    return (
      <div className={`p-4 rounded-lg ${countdownStyle === "modern" ? "bg-indigo-100" : "bg-gray-100"}`}>
        <h3 className="text-lg font-semibold text-gray-900">Countdown to {holidayName}</h3>
        <div
          className={`grid grid-cols-4 gap-2 text-center ${
            countdownStyle === "modern" ? "text-indigo-600" : "text-gray-600"
          }`}
        >
          <div>
            <span className="text-2xl font-bold">{timeLeft.days}</span>
            <p className="text-sm">Days</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{timeLeft.hours}</span>
            <p className="text-sm">Hours</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{timeLeft.minutes}</span>
            <p className="text-sm">Minutes</p>
          </div>
          <div>
            <span className="text-2xl font-bold">{timeLeft.seconds}</span>
            <p className="text-sm">Seconds</p>
          </div>
        </div>
      </div>
    );
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">
          Holidays in {countryName} ({year})
        </h1>

        <div className="flex justify-between items-center mb-6">
          <div>
            <label htmlFor="year" className="block text-sm font-medium text-gray-700">
              Select Year
            </label>
            <select
              id="year"
              value={year}
              onChange={handleYearChange}
              className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              {yearOptions.map((y) => (
                <option key={y} value={y}>
                  {y}
                </option>
              ))}
            </select>
          </div>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Loader2 className="h-12 w-12 animate-spin text-indigo-600" />
            <p className="mt-4 text-lg font-medium text-gray-700">Loading holidays...</p>
          </div>
        ) : (
          <div className="space-y-8">
            {/* Clock Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Clock Widget</h2>
              <div className="flex flex-col sm:flex-row sm:space-x-6">
                <div className="mb-4 sm:mb-0">
                  <Clock
                    ref={clockRef}
                    value={currentTime}
                    size={150}
                    hourMarks={clockFormat === "24h"}
                    renderNumbers
                    hourHandColor={clockColor}
                    minuteHandColor={clockColor}
                    secondHandColor={clockColor}
                  />
                </div>
                <div>
                  <label htmlFor="clockColor" className="block text-sm font-medium text-gray-700">
                    Clock Color
                  </label>
                  <input
                    type="color"
                    id="clockColor"
                    value={clockColor}
                    onChange={handleClockColorChange}
                    className="mt-1 w-20 h-10 rounded-md"
                  />
                  <label htmlFor="clockFormat" className="block text-sm font-medium text-gray-700 mt-4">
                    Time Format
                  </label>
                  <select
                    id="clockFormat"
                    value={clockFormat}
                    onChange={handleClockFormatChange}
                    className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    <option value="12h">12-Hour</option>
                    <option value="24h">24-Hour</option>
                  </select>
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Embed Code</label>
                    <textarea
                      readOnly
                      value={generateEmbedCode("clock")}
                      className="mt-1 w-full h-20 rounded-md border-gray-300 shadow-sm p-2 text-sm"
                    />
                    <button
                      onClick={() => navigator.clipboard.write(generateEmbedCode("clock"))}
                      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Copy Embed Code
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Calendar Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Calendar Widget</h2>
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin]}
                initialView="dayGridMonth"
                events={events}
                height="auto"
                eventContent={(eventInfo) => (
                  <div className="p-1">
                    <p className={eventInfo.event.classNames}>{eventInfo.event.title}</p>
                    {eventInfo.event.extendedProps.note && (
                      <p className="text-xs text-gray-500">{eventInfo.event.extendedProps.note}</p>
                    )}
                  </div>
                )}
              />
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700">Embed Code</label>
                <textarea
                  readOnly
                  value={generateEmbedCode("calendar")}
                  className="mt-1 w-full h-20 rounded-md border-gray-300 shadow-sm p-2 text-sm"
                />
                <button
                  onClick={() => navigator.clipboard.write(generateEmbedCode("calendar"))}
                  className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                >
                  Copy Embed Code
                </button>
              </div>
            </div>

            {/* Countdown Widget */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Countdown Widget</h2>
              <div className="mb-4">
                <label htmlFor="holidaySelect" className="block text-sm font-medium text-gray-700">
                  Select Holiday for Countdown
                </label>
                <select
                  id="holidaySelect"
                  value={selectedHoliday?.date || ""}
                  onChange={handleHolidaySelect}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a holiday</option>
                  {events
                    .filter((event) => new Date(event.date) > new Date())
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((event) => (
                      <option key={event.date} value={event.date}>
                        {event.title} (
                        {new Date(event.date).toLocaleDateString("en-US", {
                          month: "long",
                          day: "numeric",
                        })}
                        )
                      </option>
                    ))}
                </select>
                <label htmlFor="countdownStyle" className="block text-sm font-medium text-gray-700 mt-4">
                  Countdown Style
                </label>
                <select
                  id="countdownStyle"
                  value={countdownStyle}
                  onChange={handleCountdownStyleChange}
                  className="mt-1 block w-48 rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="modern">Modern</option>
                  <option value="minimal">Minimal</option>
                </select>
              </div>
              {selectedHoliday && (
                <>
                  <CountdownTimer
                    ref={countdownRef}
                    targetDate={selectedHoliday.date}
                    holidayName={selectedHoliday.title}
                  />
                  <div className="mt-4">
                    <label className="block text-sm font-medium text-gray-700">Embed Code</label>
                    <textarea
                      readOnly
                      value={generateEmbedCode("countdown")}
                      className="mt-1 w-full h-20 rounded-md border-gray-300 shadow-sm p-2 text-sm"
                    />
                    <button
                      onClick={() => navigator.clipboard.write(generateEmbedCode("countdown"))}
                      className="mt-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                    >
                      Copy Embed Code
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* List View */}
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Holiday List</h2>
              {events.length === 0 ? (
                <p className="text-gray-600">
                  No holidays found for {countryName} in {year}.
                </p>
              ) : (
                <div className="grid grid-cols-1 gap-4">
                  {events
                    .sort((a, b) => a.date.localeCompare(b.date))
                    .map((event, index) => (
                      <div
                        key={`${event.date}-${index}`}
                        className="flex justify-between border-b border-gray-200 py-2"
                      >
                        <div>
                          <span className={event.className}>{event.title}</span>
                          {event.extendedProps.note && (
                            <p className="text-sm text-gray-500">{event.extendedProps.note}</p>
                          )}
                        </div>
                        <span className="text-gray-600">
                          {new Date(event.date).toLocaleDateString("en-US", {
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Legend for holiday types */}
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">Legend</h2>
              <div className="flex space-x-6">
                <div>
                  <span className="text-red-600 font-semibold">■</span> Public Holiday
                </div>
                <div>
                  <span className="text-blue-600 font-semibold">■</span> Religious Holiday
                </div>
                <div>
                  <span className="text-green-600">■</span> Observance
                </div>
                <div>
                  <span className="text-gray-600">■</span> Other
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default HolidayDetail;
