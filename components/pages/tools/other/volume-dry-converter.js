"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("liter [L, l]");
  const [toUnit, setToUnit] = useState("liter [L, l]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "liter [L, l]", toLiter: 1 },
    { name: "barrel dry (US) [bbl dry (US)]", toLiter: 115.6271236039 },
    { name: "pint dry (US) [pt dry (US)]", toLiter: 0.5506104714 },
    { name: "quart dry (US) [qt dry (US)]", toLiter: 1.1012209428 },
    { name: "peck (US) [pk (US)]", toLiter: 8.8097675424 },
    { name: "peck (UK) [pk (UK)]", toLiter: 9.09218 },
    { name: "bushel (US) [bu (US)]", toLiter: 35.2390701696 },
    { name: "bushel (UK) [bu (UK)]", toLiter: 36.36872 },
    { name: "cor (Biblical)", toLiter: 219.9999892918 },
    { name: "homer (Biblical)", toLiter: 219.9999892918 },
    { name: "ephah (Biblical)", toLiter: 21.9999989292 },
    { name: "seah (Biblical)", toLiter: 7.3333329764 },
    { name: "omer (Biblical)", toLiter: 2.1999998929 },
    { name: "cab (Biblical)", toLiter: 1.2222221627 },
    { name: "log (Biblical)", toLiter: 0.3055555407 },
  ];

  const convertVolume = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    const liter = value * fromUnitData.toLiter;
    const resultValue = liter / toUnitData.toLiter;
    setResult(`Result: ${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Volume - Dry Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Enter value"
              step="any"
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
                <option key={unit.name} value={unit.name}>
                  {unit.name}
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
                <option key={unit.name} value={unit.name}>
                  {unit.name}
                </option>
              ))}
            </select>
          </div>
          <button
            onClick={convertVolume}
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
