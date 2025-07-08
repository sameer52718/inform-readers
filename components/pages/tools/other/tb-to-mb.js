"use client";

import { useState } from "react";

export default function Home() {
  const [tb, setTb] = useState("");
  const [result, setResult] = useState("Result: ");

  const convertTbToMb = () => {
    const tbValue = parseFloat(tb);
    if (isNaN(tbValue) || tbValue < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }
    const mb = tbValue * 1024 * 1024;
    const formattedMb = mb.toFixed(6).replace(/\.?0+$/, "");
    setResult(`Result: ${tbValue} TB = ${formattedMb} MB`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-8 rounded-lg shadow-lg text-center w-80">
        <h2 className="text-red-500 text-2xl mb-5">TB to MB</h2>
        <input
          type="number"
          value={tb}
          onChange={(e) => setTb(e.target.value)}
          placeholder="Enter TB"
          step="any"
          min="0"
          className="p-2 w-11/12 mb-4 border-2 border-red-500 rounded-md text-base"
        />
        <button
          onClick={convertTbToMb}
          className="p-2 bg-red-500 text-white border-none rounded-md cursor-pointer text-base hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
