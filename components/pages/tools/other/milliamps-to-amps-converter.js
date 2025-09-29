"use client";
import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(<span className="text-red-500">Please enter a valid number</span>);
      return;
    }
    const converted = value * 0.001;
    setResult(`${value} mA = ${converted.toFixed(6)} A`);
  };

  return (
    <>
      <div className="bg-white  flex justify-center items-center">
        <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
          <h1 className="text-red-500 text-2xl font-bold text-center mb-5">Milliamps to Amps Converter</h1>
          <div className="mb-4">
            <label htmlFor="inputValue" className="block text-sm font-medium mb-2">
              Value (milliamps [mA])
            </label>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value in milliamps"
              className="w-full p-2 bg-gray-200 rounded-md text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <button
            onClick={handleConvert}
            className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
          >
            Convert to Amps
          </button>
          <div className="mt-5 text-center text-base" id="result">
            {result}
          </div>
        </div>
      </div>
    </>
  );
}
