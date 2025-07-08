"use client";

import { useState } from "react";

export default function TonToBtuConverter() {
  const [ton, setTon] = useState("");
  const [result, setResult] = useState("");

  const convertTonToBtu = () => {
    const tonValue = parseFloat(ton);
    if (!isNaN(tonValue)) {
      const btu = tonValue * 12000;
      setResult(`${tonValue} ton = ${btu.toFixed(2)} BTU/h`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 text-center w-full max-w-xs">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Ton to BTU/h</h2>
        <input
          type="number"
          placeholder="Enter ton"
          value={ton}
          onChange={(e) => setTon(e.target.value)}
          step="any"
          className="p-2.5 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertTonToBtu}
          className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-base cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
