"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("degree [°]");
  const [toUnit, setToUnit] = useState("radian [rad]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "degree [°]", toDegree: 1 },
    { name: "radian [rad]", toDegree: 57.2957795131 },
    { name: "grad [^g]", toDegree: 0.9 },
    { name: "minute ['']", toDegree: 0.0166666667 },
    { name: 'second [""]', toDegree: 0.0002777778 },
    { name: "gon", toDegree: 0.9 },
    { name: "sign", toDegree: 30 },
    { name: "mil", toDegree: 0.05625 },
    { name: "revolution [r]", toDegree: 360 },
    { name: "circle", toDegree: 360 },
    { name: "turn", toDegree: 360 },
    { name: "quadrant", toDegree: 90 },
    { name: "right angle", toDegree: 90 },
    { name: "sextant", toDegree: 60 },
  ];

  const convertAngle = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);
    const degree = value * fromUnitData.toDegree;
    const converted = degree / toUnitData.toDegree;
    setResult(`Result: ${value} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Angle Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              placeholder="Enter value"
              step="any"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
            onClick={convertAngle}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition"
          >
            Convert
          </button>
          <div className="text-center text-lg font-medium text-gray-800 mt-4">{result}</div>
        </div>
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
