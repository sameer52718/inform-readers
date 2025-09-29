"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("A");
  const [toUnit, setToUnit] = useState("mA");
  const [result, setResult] = useState("");

  const units = ["A", "kA", "mA", "Bi", "abA", "EMU", "stA", "ESU", "CGS e.m.", "CGS e.s."];

  const toAmpere = {
    A: 1,
    kA: 1000,
    mA: 0.001,
    Bi: 10,
    abA: 10,
    EMU: 10,
    stA: 3.335641e-10,
    ESU: 3.335641e-10,
    "CGS e.m.": 10,
    "CGS e.s.": 3.335641e-10,
  };

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span style="color: red;">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toAmpere) || !(toUnit in toAmpere)) {
      setResult('<span style="color: red;">Invalid unit selected</span>');
      return;
    }

    const converted = (value * toAmpere[fromUnit]) / toAmpere[toUnit];
    setResult(`${value} ${fromUnit} = ${converted.toFixed(10)} ${toUnit}`);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-red-500 mb-6">Current Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700 mb-2">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            placeholder="Enter value"
            step="any"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700 mb-2">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit === "A"
                    ? "ampere [A]"
                    : unit === "kA"
                    ? "kiloampere [kA]"
                    : unit === "mA"
                    ? "milliampere [mA]"
                    : unit === "Bi"
                    ? "biot [Bi]"
                    : unit === "abA"
                    ? "abampere [abA]"
                    : unit === "EMU"
                    ? "EMU of current"
                    : unit === "stA"
                    ? "statampere [stA]"
                    : unit === "ESU"
                    ? "ESU of current"
                    : unit === "CGS e.m."
                    ? "CGS e.m. unit"
                    : "CGS e.s. unit"}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700 mb-2">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit} value={unit}>
                  {unit === "A"
                    ? "ampere [A]"
                    : unit === "kA"
                    ? "kiloampere [kA]"
                    : unit === "mA"
                    ? "milliampere [mA]"
                    : unit === "Bi"
                    ? "biot [Bi]"
                    : unit === "abA"
                    ? "abampere [abA]"
                    : unit === "EMU"
                    ? "EMU of current"
                    : unit === "stA"
                    ? "statampere [stA]"
                    : unit === "ESU"
                    ? "ESU of current"
                    : unit === "CGS e.m."
                    ? "CGS e.m. unit"
                    : "CGS e.s. unit"}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convert}
          className="w-full bg-red-500 text-white p-3 rounded-md hover:bg-red-600 transition font-bold"
        >
          Convert
        </button>
        <div
          className="mt-5 text-center text-lg font-medium text-gray-800"
          dangerouslySetInnerHTML={{ __html: result }}
        />
        <style jsx>{`
          input:focus,
          select:focus {
            outline: none;
            box-shadow: 0 0 5px rgba(239, 68, 68, 0.3);
          }
        `}</style>
      </div>
    </div>
  );
}
