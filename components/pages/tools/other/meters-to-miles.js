"use client";

import { useState } from "react";

export default function Home() {
  const [meters, setMeters] = useState("");
  const [result, setResult] = useState("");

  const convertMetersToMiles = () => {
    const metersValue = parseFloat(meters);
    if (!isNaN(metersValue)) {
      const miles = metersValue * 0.000621371;
      setResult(`${metersValue} meters = ${miles.toFixed(6)} miles`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Meters to Miles</h2>
        <input
          type="number"
          value={meters}
          onChange={(e) => setMeters(e.target.value)}
          placeholder="Enter meters"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertMetersToMiles}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
