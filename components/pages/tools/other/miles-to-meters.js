"use client";

import { useState } from "react";

export default function Home() {
  const [miles, setMiles] = useState("");
  const [result, setResult] = useState("");

  const convertMilesToMeters = () => {
    const milesValue = parseFloat(miles);
    if (!isNaN(milesValue)) {
      const meters = milesValue * 1609.34;
      setResult(`${milesValue} miles = ${meters.toFixed(3)} meters`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Miles to Meters</h2>
        <input
          type="number"
          value={miles}
          onChange={(e) => setMiles(e.target.value)}
          placeholder="Enter miles"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertMilesToMeters}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
