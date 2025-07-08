"use client";

import { useState } from "react";

export default function Home() {
  const units = ["Celsius", "Fahrenheit", "Kelvin"];
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Celsius");
  const [toUnit, setToUnit] = useState("Celsius");
  const [result, setResult] = useState("Result: ");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    let celsius;
    if (fromUnit === "Celsius") {
      celsius = value;
    } else if (fromUnit === "Fahrenheit") {
      celsius = ((value - 32) * 5) / 9;
    } else if (fromUnit === "Kelvin") {
      celsius = value - 273.15;
    }

    let converted;
    if (toUnit === "Celsius") {
      converted = celsius;
    } else if (toUnit === "Fahrenheit") {
      converted = (celsius * 9) / 5 + 32;
    } else if (toUnit === "Kelvin") {
      converted = celsius + 273.15;
    }

    if (toUnit === "Kelvin" && converted < 0) {
      setResult("Result: Temperature cannot be below 0 Kelvin");
      return;
    }

    setResult(`Result: ${value} ${fromUnit} = ${converted.toFixed(2)} ${toUnit}`);
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Temperature Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Temperature
            </label>
            <input
              type="number"
              id="inputValue"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter temperature"
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div>
            <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700">
              From Unit
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700">
              To Unit
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={handleConvert}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Convert
          </button>
          <div className="text-center text-lg font-medium text-gray-800 mt-4">{result}</div>
        </div>
      </div>
    </div>
  );
}
