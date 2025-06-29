"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { Loader2 } from "lucide-react";
import Holidays from "date-holidays";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import Select from "@/components/ui/Select";

export default function CalendarPage() {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [country, setCountry] = useState("PK");
  const [year, setYear] = useState(new Date().getFullYear());
  const [countries, setCountries] = useState([]);
  const [view, setView] = useState("dayGridMonth");

  const calendarRef = useRef(null);
  const componentRef = useRef();

  const handleExportPDF = async () => {
    if (isLoading || !componentRef.current) {
      alert("Please wait for the calendar to load.");
      return;
    }

    const input = componentRef.current;

    try {
      const canvas = await html2canvas(input, {
        scale: 2,
        useCORS: true,
      });

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF("p", "mm", "a4");

      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Calendar_${country}_${year}.pdf`);
    } catch (error) {
      console.error("PDF export failed:", error);
      alert("Failed to export PDF. Try again.");
    }
  };

  const hd = useMemo(() => new Holidays(), []);

  useEffect(() => {
    const countryList = hd.getCountries();
    const countryOptions = Object.entries(countryList).map(([code, name]) => ({
      value: code,
      label: name,
    }));
    setCountries(countryOptions);
  }, [hd]);

  useEffect(() => {
    setIsLoading(true);

    try {
      hd.init(country);

      const holidays = hd.getHolidays(year).map((holiday) => ({
        title: holiday.name,
        date: holiday.date.split(" ")[0],
        className: getHolidayClass(holiday.type),
        extendedProps: {
          type: holiday.type,
          note: holiday.note || "",
        },
      }));

      setEvents(holidays);
    } catch (error) {
      console.error("Error fetching holidays:", error);
      setEvents([]);
    } finally {
      setIsLoading(false);
    }
  }, [country, year, hd]);

  const getHolidayClass = (type) => {
    switch (type?.toLowerCase()) {
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

  const handleCountryChange = (e) => setCountry(e.target.value);
  const handleYearChange = (e) => {
    const newYear = parseInt(e.target.value);
    setYear(newYear);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.gotoDate(`${newYear}-01-01`);
    }
  };

  const handleViewChange = (e) => {
    const newView = e.target.value;
    setView(newView);

    const calendarApi = calendarRef.current?.getApi();
    if (calendarApi) {
      calendarApi.changeView(newView);
    }
  };

  const yearOptions = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return Array.from({ length: 11 }, (_, i) => currentYear - 5 + i);
  }, []);

  const viewOptions = [
    { value: "dayGridMonth", label: "1 Month" },
    { value: "multiMonthThree", label: "3 Months" },
    { value: "multiMonthSix", label: "6 Months" },
    { value: "multiMonthYear", label: "Whole Year" },
  ];

  const views = {
    multiMonthThree: {
      type: "multiMonth",
      duration: { months: 3 },
    },
    multiMonthSix: {
      type: "multiMonth",
      duration: { months: 6 },
    },
    multiMonthYear: {
      type: "multiMonth",
      duration: { months: 12 },
    },
  };

  return (
    <main className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8 no-print">
          <h1 className="text-3xl font-bold text-gray-900">Holiday Calendar</h1>
          <div className="flex gap-x-4">
            <div className="min-w-[180px]">
              <Select
                id={"country"}
                value={country}
                onChange={handleCountryChange}
                label={"Country"}
                placeholder="Select Contry"
                options={countries}
              />
            </div>
            <div className="min-w-[180px]">
              <Select
                id={"year"}
                value={year}
                onChange={handleYearChange}
                label={"Year"}
                placeholder="Select Year"
                options={yearOptions}
              />
            </div>
            <div>
              <Select
                id={"view"}
                value={view}
                onChange={handleViewChange}
                label={"View"}
                placeholder="Select View"
                options={viewOptions}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">&nbsp;</label>
              <button
                onClick={handleExportPDF}
                className="mt-1 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                Print Calendar
              </button>
            </div>
          </div>
        </div>

        <div ref={componentRef} className="bg-white rounded-xl shadow-sm p-6 min-h-[200px] relative">
          {isLoading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-white bg-opacity-80 z-10">
              <Loader2 className="h-12 w-12 animate-spin text-red-600" />
              <p className="mt-4 text-lg font-medium text-gray-700">Loading holidays...</p>
            </div>
          ) : (
            <FullCalendar
              ref={calendarRef}
              plugins={[dayGridPlugin, multiMonthPlugin]}
              initialView={view}
              views={views}
              events={events}
              height="auto"
              eventContent={(eventInfo) => (
                <div className="p-1" key={eventInfo.event.id || eventInfo.event.title}>
                  <p className={eventInfo.event.classNames.join(" ")}>{eventInfo.event.title}</p>
                  {eventInfo.event.extendedProps.note && (
                    <p className="text-xs text-gray-500">{eventInfo.event.extendedProps.note}</p>
                  )}
                </div>
              )}
            />
          )}
        </div>
      </div>

      {/* Legend */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-6">
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
    </main>
  );
}
