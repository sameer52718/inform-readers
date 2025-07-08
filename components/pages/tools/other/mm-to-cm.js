"use client";

import { useState } from "react";

export default function Home() {
  const [mm, setMm] = useState("");
  const [result, setResult] = useState("");

  const convertMmToCm = () => {
    const mmValue = parseFloat(mm);
    if (!isNaN(mmValue)) {
      const cm = mmValue / 10;
      setResult(`${mmValue} mm = ${cm.toFixed(3)} cm`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-6 rounded-lg shadow-lg text-center w-72">
        <h2 className="text-red-500 text-xl mb-4">MM to CM</h2>
        <input
          type="number"
          value={mm}
          onChange={(e) => setMm(e.target.value)}
          placeholder="Enter millimeters"
          step="any"
          className="p-2 w-[85%] mb-3 border border-red-500 rounded text-sm"
        />
        <button
          onClick={convertMmToCm}
          className="p-2 bg-red-500 text-white rounded cursor-pointer text-sm hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-4 text-base text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
