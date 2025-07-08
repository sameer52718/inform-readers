"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("A/m");
  const [toUnit, setToUnit] = useState("A/m");
  const [result, setResult] = useState("");

  const units = [
    { value: "A/m", label: "ampere/meter [A/m]" },
    { value: "A/cm", label: "ampere/centimeter [A/cm]" },
    { value: "A/in", label: "ampere/inch [A/in]" },
    { value: "abA/m", label: "abampere/meter [abA/m]" },
    { value: "abA/cm", label: "abampere/centimeter [abA/cm]" },
    { value: "abA/in", label: "abampere/inch [abA/in]" },
    { value: "Oe", label: "oersted [Oe]" },
    { value: "Gi/cm", label: "gilbert/centimeter [Gi/cm]" },
  ];

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number");
      return;
    }

    const toAM = {
      "A/m": 1,
      "A/cm": 100,
      "A/in": 39.3700787402,
      "abA/m": 10,
      "abA/cm": 1000,
      "abA/in": 393.7007874016,
      Oe: 79.5774715102,
      "Gi/cm": 79.5774715102,
    };

    if (!(fromUnit in toAM) || !(toUnit in toAM)) {
      setResult("Invalid unit selected");
      return;
    }

    const resultValue = (value * toAM[fromUnit]) / toAM[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="bg-gray-100 p-5 rounded-lg shadow-lg max-w-md w-full">
        <h1 className="text-2xl font-bold text-center text-red-500 mb-5">Linear Current Density Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm mb-1">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block text-sm mb-1">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block text-sm mb-1">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
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
          onClick={convert}
          className="w-full p-2 bg-red-500 text-white rounded-md font-bold hover:bg-red-600"
        >
          Convert
        </button>
        <div className="mt-5 text-center text-base text-gray-800">{result}</div>
      </div>
    </div>
  );
}
