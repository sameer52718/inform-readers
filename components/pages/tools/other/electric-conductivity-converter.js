"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("S/m");
  const [toUnit, setToUnit] = useState("S/m");
  const [result, setResult] = useState("");

  const toSiemensMeter = {
    "S/m": 1,
    "pS/m": 1.0e-12,
    "mho/m": 1,
    "mho/cm": 100,
    "abmho/m": 1000000000,
    "abmho/cm": 100000000000,
    "stmho/m": 1.1126534560019e-12,
    "stmho/cm": 1.1126534560019e-10,
  };

  const units = Object.keys(toSiemensMeter);

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toSiemensMeter) || !(toUnit in toSiemensMeter)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    const resultValue = (value * toSiemensMeter[fromUnit]) / toSiemensMeter[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="flex justify-center items-center  bg-white">
      <div className="bg-gray-100 p-5 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-red-500 text-2xl text-center mb-5">Electric Conductivity Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block mb-1 text-sm">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block mb-1 text-sm">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block mb-1 text-sm">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 border-none rounded-md text-base text-gray-800 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convert}
          className="w-full p-2 bg-red-500 text-white font-bold border-none rounded-md cursor-pointer hover:bg-red-600"
        >
          Convert
        </button>
        <div
          className="mt-5 text-base text-gray-800 text-center"
          dangerouslySetInnerHTML={{ __html: result }}
        />
      </div>
    </div>
  );
}
