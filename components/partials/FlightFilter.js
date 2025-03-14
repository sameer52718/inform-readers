"use client"


import { useState } from "react";
import { Icon } from "@iconify/react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const FlightFilter = () => {
  const [from, setFrom] = useState("Multan (Mux)");
  const [to, setTo] = useState("Dubai (Dxb)");
  const [date, setDate] = useState(null);
  const [passengers, setPassengers] = useState("1 Adult Economy");

  const handleSearch = () => {
    console.log("Searching flights with:", { from, to, date, passengers });
    alert(`Searching flights from ${from} to ${to} on ${date} for ${passengers}`);
  };

  return (
    <div className="bg-gray-900 p-4 rounded-lg grid grid-cols-1 md:grid-cols-5 gap-2">
      {/* From */}
      <div className="bg-white flex items-center px-4 py-2 rounded-lg w-full">
        <select
          className="w-full outline-none"
          value={from}
          onChange={(e) => setFrom(e.target.value)}
        >
          <option>Multan (Mux)</option>
          <option>Lahore (LHE)</option>
          <option>Karachi (KHI)</option>
        </select>
      </div>

     

      {/* To */}
      <div className="bg-white flex items-center px-4 py-2 rounded-lg w-full">
        <select
          className="w-full outline-none"
          value={to}
          onChange={(e) => setTo(e.target.value)}
        >
          <option>Dubai (Dxb)</option>
          <option>Doha (DOH)</option>
          <option>Istanbul (IST)</option>
        </select>
      </div>

      {/* Date Picker */}
      <div className="bg-white flex items-center px-4 py-2 rounded-lg w-full">
        <DatePicker
          selected={date}
          onChange={(date) => setDate(date)}
          placeholderText="Select Date"
          className="w-full outline-none cursor-pointer"
        />
      </div>

      {/* Passenger Selection */}
      <div className="bg-white flex items-center px-4 py-2 rounded-lg w-full">
        <select
          className="w-full outline-none"
          value={passengers}
          onChange={(e) => setPassengers(e.target.value)}
        >
          <option>1 Adult Economy</option>
          <option>2 Adults Economy</option>
          <option>1 Adult Business</option>
        </select>
      </div>

      {/* Search Button */}
      <div className="w-full flex justify-center">
        <button
          onClick={handleSearch}
          className="bg-white p-3 w-full flex justify-center rounded-lg hover:bg-gray-200 transition"
        >
          <Icon icon="mdi:magnify" className="text-2xl text-blue-500" />
        </button>
      </div>
    </div>


  );
};

export default FlightFilter;
