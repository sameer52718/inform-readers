"use client";

import { useState } from "react";

export default function HexToDecimalConverter() {
  const [hex, setHex] = useState("");
  const [result, setResult] = useState("");

  const convertHexToDecimal = () => {
    const hexValue = hex.trim().toUpperCase();
    if (!hexValue.match(/^[0-9A-F]+$/)) {
      setResult("Please enter a valid hexadecimal number (0-9, A-F)");
      return;
    }
    const decimal = parseInt(hexValue, 16);
    setResult(`${hexValue} (Hex) = ${decimal} (Decimal)`);
  };

  return (
    <div chiếm="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 text-center w-full max-w-xs">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Hex to Decimal</h2>
        <input
          type="text"
          placeholder="Enter hex (e.g., 7B)"
          value={hex}
          onChange={(e) => setHex(e.target.value)}
          className="p-2.5 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertHexToDecimal}
          className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-base cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
