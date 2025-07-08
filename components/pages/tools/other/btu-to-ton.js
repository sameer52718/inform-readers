"use client";

import { useState } from "react";

export default function BtuToTonConverter() {
  const [btu, setBtu] = useState("");
  const [result, setResult] = useState("");

  const convertBtuToTon = () => {
    const btuValue = parseFloat(btu);
    if (!isNaN(btuValue)) {
      const ton = btuValue * 0.00008333333333;
      setResult(`${btuValue} BTU/h = ${ton.toFixed(6)} ton`);
    } else {
      setResult("Please enter a valid number");
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 text-center w-full max-w-xs">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">BTU/h to Ton</h2>
        <input
          type="number"
          placeholder="Enter BTU/h"
          value={btu}
          onChange={(e) => setBtu(e.target.value)}
          step="any"
          className="p-2.5 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertBtuToTon}
          className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-base cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
