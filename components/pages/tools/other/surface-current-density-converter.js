"use client";

import { useState } from "react";

export default function Home() {
  const units = [
    { value: "A/m²", label: "ampere/square meter [A/m²]" },
    { value: "A/cm²", label: "ampere/square centimeter [A/cm²]" },
    { value: "A/in²", label: "ampere/square inch [A/in²]" },
    { value: "A/mi²", label: "ampere/square mil [A/mi²]" },
    { value: "A/circular mil", label: "ampere/circular mil" },
    { value: "abA/cm²", label: "abampere/square centimeter [abA/cm²]" },
  ];

  const toAM2 = {
    "A/m²": 1,
    "A/cm²": 10000,
    "A/in²": 1550.0031000062,
    "A/mi²": 1550003100.0062,
    "A/circular mil": 1973525240.9908,
    "abA/cm²": 100000,
  };

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("A/m²");
  const [toUnit, setToUnit] = useState("A/m²");
  const [result, setResult] = useState("");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult(<span className="text-red-500">Please enter a valid number</span>);
      return;
    }

    if (!(fromUnit in toAM2) || !(toUnit in toAM2)) {
      setResult(<span className="text-red-500">Invalid unit selected</span>);
      return;
    }

    const converted = (value * toAM2[fromUnit]) / toAM2[toUnit];
    setResult(`${value} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="bg-white min-h-screen flex justify-center items-center">
      <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
        <h1 className="text-red-500 text-2xl font-bold text-center mb-5">
          Surface Current Density Converter
        </h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm font-medium mb-2">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 rounded-md text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block text-sm font-medium mb-2">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block text-sm font-medium mb-2">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-gray-900 text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={handleConvert}
          className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition-colors"
        >
          Convert
        </button>
        <div className="mt-5 text-center text-base" id="result">
          {result}
        </div>
      </div>
    </div>
  );
}
