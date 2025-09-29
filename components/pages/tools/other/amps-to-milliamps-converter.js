"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span style="color: red;">Please enter a valid number</span>');
      return;
    }
    const milliamps = value * 1000;
    setResult(`${value} A = ${milliamps.toFixed(6)} mA`);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-6">Amps to Milliamps Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-2">
            Value (amps [A])
          </label>
          <input
            type="number"
            id="inputValue"
            placeholder="Enter value in amps"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <button
          onClick={convert}
          className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition font-bold"
        >
          Convert to Milliamps
        </button>
        <div
          className="mt-5 text-center text-lg font-medium text-gray-800"
          dangerouslySetInnerHTML={{ __html: result }}
        />
        <style jsx>{`
          input:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
}
