"use client";

import { useState } from "react";

export default function KgToNewtonsConverter() {
  const [kg, setKg] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertKgToNewtons = () => {
    const kgValue = parseFloat(kg);
    if (isNaN(kgValue) || kgValue < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }
    const newtons = kgValue * 9.80665;
    const formattedNewtons = newtons.toFixed(6).replace(/\.?0+$/, "");
    setResult(`Result: ${kgValue} kg = ${formattedNewtons} N`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">kg to Newtons</h2>
        <input
          type="number"
          value={kg}
          onChange={(e) => setKg(e.target.value)}
          placeholder="Enter kg"
          step="any"
          min="0"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertKgToNewtons}
          className="p-2 bg-red-500 text-white rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
