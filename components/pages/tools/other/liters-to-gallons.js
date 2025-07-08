"use client";

import { useState } from "react";

export default function LitersToGallonsConverter() {
  const [liters, setLiters] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertLitersToGallons = () => {
    const litersValue = parseFloat(liters);
    if (!isNaN(litersValue)) {
      const gallons = litersValue * 0.264172;
      setResult(`Result: ${litersValue} liters = ${gallons.toFixed(3)} gallons`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">Liters to Gallons</h2>
        <input
          type="number"
          value={liters}
          onChange={(e) => setLiters(e.target.value)}
          placeholder="Enter liters"
          step="any"
          className="p-2 w-4/5 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertLitersToGallons}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
