"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("Result: ");

  const handleConvert = () => {
    const pounds = parseFloat(inputValue);
    if (!isNaN(pounds)) {
      const ounces = pounds * 16;
      setResult(`Result: ${pounds} pounds = ${ounces.toFixed(3)} ounces`);
    } else {
      setResult("Result: Please enter a valid number");
    }
  };

  return (
    <div className="bg-white  flex justify-center items-center">
      <div className="bg-gray-100 p-8 rounded-xl shadow-lg text-center w-full max-w-xs">
        <h2 className="text-red-500 text-2xl font-bold mb-5">Pounds to Ounces</h2>
        <input
          type="number"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Enter pounds"
          step="any"
          className="p-2 w-[85%] mb-4 border-2 border-red-500 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
        />
        <button
          onClick={handleConvert}
          className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 text-base font-semibold cursor-pointer"
        >
          Convert
        </button>
        <div className="mt-5 text-lg text-gray-800">{result}</div>
      </div>
    </div>
  );
}
