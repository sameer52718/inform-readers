"use client";

import { useState } from "react";

export default function Home() {
  const [mm, setMm] = useState("");
  const [result, setResult] = useState("");

  const convertMmToInches = () => {
    const mmValue = parseFloat(mm);
    if (!isNaN(mmValue)) {
      const inches = mmValue * 0.0393701;
      setResult(`${mmValue} mm = ${inches.toFixed(3)} inches`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-9 rounded-2xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">MM to Inches</h2>
        <input
          type="number"
          value={mm}
          onChange={(e) => setMm(e.target.value)}
          placeholder="Enter millimeters"
          step="any"
          className="p-3 w-[90%] mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertMmToInches}
          className="p-3 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
