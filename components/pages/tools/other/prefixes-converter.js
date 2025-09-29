"use client";

import { useState } from "react";

const units = [
  { name: "none", value: "none", toNone: 1 },
  { name: "yotta [Y]", value: "Y", toNone: 1.0e24 },
  { name: "zetta [Z]", value: "Z", toNone: 1.0e21 },
  { name: "exa [E]", value: "E", toNone: 1.0e18 },
  { name: "peta [P]", value: "P", toNone: 1.0e15 },
  { name: "tera [T]", value: "T", toNone: 1000000000000 },
  { name: "giga [G]", value: "G", toNone: 1000000000 },
  { name: "mega [M]", value: "M", toNone: 1000000 },
  { name: "kilo [k]", value: "k", toNone: 1000 },
  { name: "hecto [h]", value: "h", toNone: 100 },
  { name: "deka [da]", value: "da", toNone: 10 },
  { name: "deci [d]", value: "d", toNone: 0.1 },
  { name: "centi [c]", value: "c", toNone: 0.01 },
  { name: "milli [m]", value: "m", toNone: 0.001 },
  { name: "micro [µ]", value: "µ", toNone: 1.0e-6 },
  { name: "nano [n]", value: "n", toNone: 1.0e-9 },
  { name: "pico [p]", value: "p", toNone: 1.0e-12 },
  { name: "femto [f]", value: "f", toNone: 1.0e-15 },
  { name: "atto [a]", value: "a", toNone: 1.0e-18 },
  { name: "zepto [z]", value: "z", toNone: 1.0e-21 },
  { name: "yocto [y]", value: "y", toNone: 1.0e-24 },
];

export default function PrefixesConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("none");
  const [toUnit, setToUnit] = useState("none");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.value === fromUnit);
    const toUnitData = units.find((unit) => unit.value === toUnit);

    if (!fromUnitData || !toUnitData) {
      setResult("Invalid unit selected");
      return;
    }

    try {
      const valueInNone = value * fromUnitData.toNone;
      const resultValue = valueInNone / toUnitData.toNone;
      setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
    } catch (error) {
      setResult("Conversion error");
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Prefixes Converter</h1>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Value
            </label>
            <input
              type="number"
              id="inputValue"
              placeholder="Enter value"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label htmlFor="fromUnit" className="block text-sm font-medium text-gray-700">
                From
              </label>
              <select
                id="fromUnit"
                value={fromUnit}
                onChange={(e) => setFromUnit(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label htmlFor="toUnit" className="block text-sm font-medium text-gray-700">
                To
              </label>
              <select
                id="toUnit"
                value={toUnit}
                onChange={(e) => setToUnit(e.target.value)}
                className="mt-1 w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {units.map((unit) => (
                  <option key={unit.value} value={unit.value}>
                    {unit.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button
            onClick={convert}
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
