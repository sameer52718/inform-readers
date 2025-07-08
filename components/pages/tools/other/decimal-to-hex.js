"use client";

import { useState } from "react";

export default function DecimalToHexConverter() {
  const [decimal, setDecimal] = useState("");
  const [result, setResult] = useState("");

  const convertDecimalToHex = () => {
    const decimalValue = parseInt(decimal);
    if (isNaN(decimalValue) || decimalValue < 0) {
      setResult("Please enter a valid non-negative integer");
      return;
    }
    const hex = decimalValue.toString(16).toUpperCase();
    setResult(`${decimalValue} (Decimal) = ${hex} (Hex)`);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 text-center w-full max-w-xs">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Decimal to Hex</h2>
        <input
          type="number"
          placeholder="Enter decimal (e.g., 123)"
          value={decimal}
          onChange={(e) => setDecimal(e.target.value)}
          step="1"
          min="0"
          className="p-2.5 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertDecimalToHex}
          className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-base cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
