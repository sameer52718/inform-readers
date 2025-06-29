"use client";

import Link from "next/link";
import React, { useState } from "react";
const Learn = () => {
  const [timeZone1, setTimeZone1] = useState("UTC");
  const [timeZone2, setTimeZone2] = useState("Asia/Karachi");
  const [convertedTime, setConvertedTime] = useState("");

  // Simple timezone converter logic
  const handleTimeConversion = () => {
    const now = new Date();
    const options = { hour: "numeric", minute: "numeric", hour12: true };
    const timeInZone1 = now.toLocaleTimeString("en-US", { timeZone: timeZone1 });
    const timeInZone2 = now.toLocaleTimeString("en-US", { timeZone: timeZone2 });
    setConvertedTime(
      `Current time in ${timeZone1}: ${timeInZone1} | Current time in ${timeZone2}: ${timeInZone2}`
    );
  };

  // List of common time zones for the converter
  const timeZones = [
    "UTC",
    "America/New_York",
    "America/Los_Angeles",
    "Asia/Karachi",
    "Asia/Tokyo",
    "Europe/London",
    "Australia/Sydney",
    "Asia/Kolkata",
  ];

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Explore Time, Calendars, and Astronomy</h1>
        <p className="text-lg text-gray-600 mb-12">
          Dive into the fascinating world of timekeeping, calendars, and the cosmos. Learn how these concepts
          shape our lives, holidays, and global traditions. Visit our{" "}
          <Link
            href="/time-and-date/holidays"
            className="text-indigo-600 hover:text-indigo-800 hover:underline"
          >
            global holidays page
          </Link>{" "}
          to see these ideas in action.
        </p>

        <div className="space-y-12">
          {/* Time Zones Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Time Zones</h2>
            <div className="prose prose-lg prose-indigo max-w-none space-y-2">
              <h3 className="text-lg">What Are Time Zones?</h3>
              <p>
                Time zones are regions of the Earth that share the same standard time, created to synchronize
                clocks across vast geographical areas. The Earth is divided into 24 primary time zones, each
                roughly 15 degrees of longitude wide, corresponding to a one-hour time difference. This system
                was formalized in the 19th century to standardize railway schedules and has since become
                critical for global communication, travel, and coordinating events like international
                holidays.
              </p>
              <h3 className="text-lg">How Time Zones Work</h3>
              <p>
                The reference point for time zones is <strong>Coordinated Universal Time (UTC)</strong>,
                aligned with the prime meridian (0° longitude) in Greenwich, London. Time zones are expressed
                as offsets from UTC, such as UTC+5 (Pakistan Standard Time, PKT) or UTC-8 (Pacific Standard
                Time, PST). Many regions observe <strong>Daylight Saving Time (DST)</strong>, shifting clocks
                forward by one hour in summer to maximize daylight, which affects holiday timings, like
                Ramadan fasting hours.
              </p>
              <h3 className="text-lg">Key Concepts</h3>
              <ul>
                <li>
                  <strong>International Date Line</strong>: Located roughly at 180° longitude, this imaginary
                  line determines where one day transitions to the next. Crossing it eastward subtracts a day,
                  westward adds one.
                </li>
                <li>
                  <strong>Non-Standard Offsets</strong>: Some regions use unique offsets, like India
                  (UTC+5:30) or Nepal (UTC+5:45), impacting local holiday celebrations.
                </li>
                <li>
                  <strong>Time Zone Challenges</strong>: Coordinating global events, such as New Year’s Eve or
                  Diwali, requires accounting for time differences. For instance, New Year’s 2025 in Sydney
                  (UTC+11) occurs 16 hours before New York (UTC-5).
                </li>
              </ul>
              <h3 className="text-lg">Why It Matters</h3>
              <p>
                Time zones influence everything from business meetings to holiday observances. For example,
                Eid al-Fitr’s timing can vary slightly across regions due to time zones and local moon
                sightings. Explore more on our{" "}
                <Link href="/time-and-date/holidays" className="text-indigo-600 hover:underline">
                  global holidays page
                </Link>
                .
              </p>
            </div>
            <div className="mt-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">Time Zone Converter</h3>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mb-4">
                <div>
                  <label htmlFor="timeZone1" className="block text-sm font-medium text-gray-700">
                    From Time Zone
                  </label>
                  <select
                    id="timeZone1"
                    value={timeZone1}
                    onChange={(e) => setTimeZone1(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {timeZones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="timeZone2" className="block text-sm font-medium text-gray-700">
                    To Time Zone
                  </label>
                  <select
                    id="timeZone2"
                    value={timeZone2}
                    onChange={(e) => setTimeZone2(e.target.value)}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  >
                    {timeZones.map((zone) => (
                      <option key={zone} value={zone}>
                        {zone}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mt-4 sm:mt-6">
                  <button
                    onClick={handleTimeConversion}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
                  >
                    Convert Time
                  </button>
                </div>
              </div>
              {convertedTime && <p className="text-gray-700">{convertedTime}</p>}
            </div>
          </section>

          {/* Calendars Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Calendars</h2>
            <div className="prose prose-lg prose-indigo max-w-none space-y-2">
              <h3 className="text-lg">What Is a Calendar?</h3>
              <p>
                A calendar is a system for organizing days, months, and years to track time and schedule
                events. Calendars align human activities with natural cycles, such as the seasons, lunar
                phases, or solar years, and are deeply tied to cultural and religious traditions.
              </p>
              <h3 className="text-lg">Historical Development</h3>
              <ul>
                <li>
                  <strong>Ancient Calendars</strong>: Early civilizations like the Egyptians (circa 3000 BCE)
                  used a 365-day solar calendar, while the Babylonians relied on lunar cycles (29.5 days).
                  These early systems laid the groundwork for modern calendars.
                </li>
                <li>
                  <strong>Julian Calendar</strong>: Introduced by Julius Caesar in 46 BCE, it standardized a
                  365.25-day year with a leap day every four years, improving accuracy over lunar-based
                  systems.
                </li>
                <li>
                  <strong>Gregorian Calendar</strong>: Adopted in 1582 by Pope Gregory XIII, it refined the
                  Julian calendar by adjusting leap years (years divisible by 100 but not 400 are not leap
                  years). It’s now the global standard.
                </li>
                <li>
                  <strong>Cultural Calendars</strong>: The Islamic (lunar), Hindu (luni-solar), Chinese
                  (luni-solar), and Jewish calendars influence holidays like Ramadan, Diwali, Chinese New
                  Year, and Passover.
                </li>
              </ul>
              <h3 className="text-lg">Calendar Systems Comparison</h3>
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gray-100">
                    <th className="border p-2">Calendar</th>
                    <th className="border p-2">Type</th>
                    <th className="border p-2">Year Length</th>
                    <th className="border p-2">Key Holidays</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border p-2">Gregorian</td>
                    <td className="border p-2">Solar</td>
                    <td className="border p-2">365.2425 days</td>
                    <td className="border p-2">Christmas, Easter, New Year</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Islamic</td>
                    <td className="border p-2">Lunar</td>
                    <td className="border p-2">~354 days</td>
                    <td className="border p-2">Ramadan, Eid al-Fitr, Eid al-Adha</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Hindu</td>
                    <td className="border p-2">Luni-Solar</td>
                    <td className="border p-2">~365 days</td>
                    <td className="border p-2">Diwali, Holi, Navratri</td>
                  </tr>
                  <tr>
                    <td className="border p-2">Chinese</td>
                    <td className="border p-2">Luni-Solar</td>
                    <td className="border p-2">~354–384 days</td>
                    <td className="border p-2">Chinese New Year, Mid-Autumn Festival</td>
                  </tr>
                </tbody>
              </table>
              <h3 className="text-lg">Why It Matters</h3>
              <p>
                Calendars determine the timing of holidays, especially movable ones like Easter (based on the
                lunar cycle in the Gregorian calendar) or Diwali (Hindu calendar). Understanding their
                diversity helps us appreciate global traditions. See these calendars in action on our{" "}
                <Link href="/time-and-date/holidays" className="text-indigo-600 hover:underline">
                  holidays page
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Astronomy Section */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Astronomy and Time</h2>
            <div className="prose prose-lg prose-indigo max-w-none space-y-2">
              <h3 className="text-lg">How Astronomy Shapes Timekeeping</h3>
              <p>
                Astronomy has defined timekeeping since ancient times. The movements of the Sun, Moon, and
                stars determine our concepts of days, months, and years, and continue to influence holidays
                and cultural practices.
              </p>
              <h3 className="text-lg">Key Astronomical Concepts</h3>
              <ul>
                <li>
                  <strong>Day</strong>: One rotation of the Earth on its axis (~24 hours), measured by the
                  Sun’s apparent movement (solar day).
                </li>
                <li>
                  <strong>Month</strong>: Originally based on the Moon’s phases (~29.5 days), though modern
                  calendars use fixed months.
                </li>
                <li>
                  <strong>Year</strong>: One orbit of the Earth around the Sun (~365.2422 days), adjusted by
                  leap years in the Gregorian calendar.
                </li>
                <li>
                  <strong>Equinoxes and Solstices</strong>: These mark seasonal changes and influence holidays
                  like Easter (spring equinox) and Yule (winter solstice).
                </li>
              </ul>
              <h3 className="text-lg">Astronomy and Holidays</h3>
              <p>
                Many holidays are tied to astronomical events:
                <ul>
                  <li>
                    <strong>Easter</strong>: First Sunday after the first full moon following the spring
                    equinox.
                  </li>
                  <li>
                    <strong>Diwali</strong>: Celebrated on the new moon in the Hindu month of Kartika.
                  </li>
                  <li>
                    <strong>Mid-Autumn Festival</strong>: Held on the full moon of the 8th lunar month in the
                    Chinese calendar.
                  </li>
                  <li>
                    <strong>Winter Solstice</strong>: Celebrated in traditions like Dongzhi Festival (China)
                    and Yule (pagan cultures).
                  </li>
                </ul>
              </p>
              <h3 className="text-lg">Modern Astronomy</h3>
              <p>
                While atomic clocks provide precise timekeeping today, astronomical observations still
                influence calendars and holidays. Phenomena like solar eclipses and meteor showers inspire
                cultural events. For example, the Perseid meteor shower in August is celebrated in some
                cultures with stargazing festivals.
              </p>
              <h3 className="text-lg">Why It Matters</h3>
              <p>
                Astronomy connects us to the cosmos, shaping how we measure time and celebrate significant
                moments. Explore holidays tied to celestial events on our{" "}
                <Link href="/time-and-date/holidays" className="text-indigo-600 hover:underline">
                  holidays page
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Additional Topic: History of Timekeeping */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">History of Timekeeping</h2>
            <div className="prose prose-lg prose-indigo max-w-none space-y-2">
              <h3 className="text-lg">Early Timekeeping</h3>
              <p>
                Humans have tracked time for millennia using natural indicators. Ancient Egyptians used
                sundials and water clocks (clepsydras) around 1500 BCE to measure daylight hours. The
                Babylonians divided the day into 12 parts, laying the foundation for our 24-hour system.
              </p>
              <h3 className="text-lg">Mechanical Clocks</h3>
              <p>
                By the 14th century, mechanical clocks appeared in Europe, using gears and weights. The
                invention of the pendulum clock by Christiaan Huygens in 1656 improved accuracy, enabling
                precise scheduling of events like religious holidays.
              </p>
              <h3 className="text-lg">Modern Timekeeping</h3>
              <p>
                The 20th century introduced quartz clocks, which use crystal vibrations, and atomic clocks,
                which measure time using atomic oscillations. Today’s atomic clocks are accurate to within a
                second over millions of years, supporting global systems like GPS and holiday coordination
                across time zones.
              </p>
              <h3 className="text-lg">Why It Matters</h3>
              <p>
                The evolution of timekeeping has shaped how we organize societies and celebrate holidays.
                Precise timekeeping ensures events like Christmas or Eid are synchronized globally. Learn more
                on our{" "}
                <Link href="/time-and-date/holidays" className="text-indigo-600 hover:underline">
                  holidays page
                </Link>
                .
              </p>
            </div>
          </section>

          {/* Additional Topic: Cultural Influences on Time */}
          <section className="bg-white rounded-xl shadow-sm p-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Cultural Influences on Time</h2>
            <div className="prose prose-lg prose-indigo max-w-none space-y-2">
              <h3 className="text-lg">Time in Different Cultures</h3>
              <p>
                Different cultures perceive and measure time uniquely, influencing their calendars and
                holidays. For example:
                <ul>
                  <li>
                    <strong>Western Cultures</strong>: Emphasize linear time, with a focus on progress and
                    fixed schedules, reflected in the Gregorian calendar.
                  </li>
                  <li>
                    <strong>Islamic Cultures</strong>: Use a lunar calendar, where months begin with the
                    sighting of the crescent moon, affecting holidays like Ramadan.
                  </li>
                  <li>
                    <strong>Indigenous Cultures</strong>: Often view time cyclically, tied to seasons or
                    natural events, influencing festivals like solstice celebrations.
                  </li>
                </ul>
              </p>
              <h3 className="text-lg">Cultural Holidays</h3>
              <p>
                Holidays reflect these cultural perspectives. The Chinese New Year, based on the luni-solar
                calendar, celebrates renewal, while Day of the Dead in Mexico aligns with seasonal cycles.
                These differences highlight the diversity of timekeeping traditions.
              </p>
              <h3 className="text-lg">Why It Matters</h3>
              <p>
                Understanding cultural perspectives on time enriches our appreciation of global holidays.
                Explore these traditions on our{" "}
                <Link href="/time-and-date/holidays" className="text-indigo-600 hover:underline">
                  holidays page
                </Link>
                .
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
};

export default Learn;
