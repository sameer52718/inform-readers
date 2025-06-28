// "use client";

// import { useState, useEffect } from "react";
// import FullCalendar from "@fullcalendar/react"; // Use the React component
// import dayGridPlugin from "@fullcalendar/daygrid";
// import { Loader2 } from "lucide-react";
// import { holidayData } from "@/constant/timeData"; // Corrected import path

// export default function CalendarPage() {
//   const [events, setEvents] = useState([]);
//   const [isLoading, setIsLoading] = useState(true);

//   useEffect(() => {
//     // Load holidays for Pakistan as an example
//     const holidays = holidayData.PK.holidays.map((holiday) => ({
//       title: holiday.name,
//       date: holiday.date,
//       className: "text-red-600",
//     }));
//     setEvents(holidays);
//     setIsLoading(false);
//   }, []);

//   return (
//     <main className="min-h-screen bg-gray-50 py-12">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//         <h1 className="text-3xl font-bold text-gray-900 mb-8">Calendar</h1>
//         {isLoading ? (
//           <div className="flex flex-col items-center justify-center py-12">
//             <Loader2 className="h-12 w-12 animate-spin text-red-600" />
//             <p className="mt-4 text-lg font-medium text-gray-700">Loading calendar...</p>
//           </div>
//         ) : (
//           <div className="bg-white rounded-xl shadow-sm p-6">
//             <FullCalendar
//               plugins={[dayGridPlugin]}
//               initialView="dayGridMonth"
//               events={events}
//               height="auto"
//             />
//           </div>
//         )}
//       </div>
//     </main>
//   );
// }

import React from "react";

const page = () => {
  return <div>page</div>;
};

export default page;
