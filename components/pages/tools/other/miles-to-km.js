"use client";

import { useState } from "react";

export default function Home() {
  const [miles, setMiles] = useState("");
  const [result, setResult] = useState("");

  const convertMilesToKm = () => {
    const milesValue = parseFloat(miles);
    if (!isNaN(milesValue)) {
      const km = milesValue * 1.60934;
      setResult(`${milesValue} miles = ${km.toFixed(3)} km`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center w-72">
        <h2 className="text-red-500 text-xl mb-4">Miles to KM</h2>
        <input
          type="number"
          value={miles}
          onChange={(e) => setMiles(e.target.value)}
          placeholder="Enter miles"
          step="any"
          className="p-2 w-[85%] mb-3 border border-red-500 rounded text-sm"
        />
        <button
          onClick={convertMilesToKm}
          className="p-2 bg-red-500 text-white rounded cursor-pointer text-sm hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-4 text-base text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
