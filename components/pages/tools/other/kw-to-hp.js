"use client";

import { useState } from "react";

export default function KwToHpConverter() {
  const [kw, setKw] = useState("");
  const [result, setResult] = useState("");

  const convertKwToHp = () => {
    const kwValue = parseFloat(kw);
    if (!isNaN(kwValue)) {
      const hp = kwValue * 1.341022089595;
      setResult(`${kwValue} kW = ${hp.toFixed(2)} hp`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 text-center w-full max-w-xs">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">kW to hp</h2>
        <input
          type="number"
          placeholder="Enter kW"
          value={kw}
          onChange={(e) => setKw(e.target.value)}
          step="any"
          className="p-2.5 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertKwToHp}
          className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-base cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
