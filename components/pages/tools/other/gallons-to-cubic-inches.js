"use client";

import { useState } from "react";

export default function GallonsToCubicInchesConverter() {
  const [gallons, setGallons] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertGallonsToCubicInches = () => {
    const gallonsValue = parseFloat(gallons);
    if (!isNaN(gallonsValue)) {
      const cubicInches = gallonsValue * 231;
      setResult(`Result: ${gallonsValue} gallons = ${cubicInches.toFixed(3)} cubic inches`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Gallons to Cubic Inches</h2>
        <input
          type="number"
          value={gallons}
          onChange={(e) => setGallons(e.target.value)}
          placeholder="Enter gallons"
          step="any"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertGallonsToCubicInches}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
