"use client";

import { useState } from "react";

export default function BinaryToHexConverter() {
  const [binary, setBinary] = useState("");
  const [result, setResult] = useState("");

  const convertBinaryToHex = () => {
    if (!binary.match(/^[0-1]+$/)) {
      setResult("Please enter a valid binary number (0 or 1)");
      return;
    }
    const decimal = parseInt(binary, 2);
    const hex = decimal.toString(16).toUpperCase();
    setResult(`${binary} (Binary) = ${hex} (Hex)`);
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 text-center w-full max-w-xs">
        <h2 className="text-2xl font-bold text-gray-800 mb-5">Binary to Hex</h2>
        <input
          type="text"
          placeholder="Enter binary (e.g., 1111011)"
          value={binary}
          onChange={(e) => setBinary(e.target.value.trim())}
          className="p-2.5 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={convertBinaryToHex}
          className="px-5 py-2.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition duration-300 text-base cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">Result: {result}</div>
      </div>
    </div>
  );
}
