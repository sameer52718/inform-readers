"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("Result: ");

  const handleConvert = () => {
    const lbs = parseFloat(inputValue);
    if (!isNaN(lbs)) {
      const kg = lbs / 2.20462;
      setResult(`Result: ${lbs} lbs = ${kg.toFixed(3)} kg`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center w-full max-w-xs">
        <h2 className="text-red-500 text-2xl font-bold mb-4">LBS to KG</h2>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter pounds"
          step="any"
          className="p-2 w-[85%] mb-3 border border-red-500 rounded text-sm focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleConvert}
          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 text-sm font-semibold cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-4 text-base text-gray-800">{result}</div>
      </div>
    </div>
  );
}
