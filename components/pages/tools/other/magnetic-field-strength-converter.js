"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Ampere/meter [A/m]");
  const [toUnit, setToUnit] = useState("Ampere/meter [A/m]");
  const [result, setResult] = useState("");

  const units = [
    { name: "Ampere/meter [A/m]", amperePerMeter: 1 },
    { name: "Ampere turn/meter [At/m]", amperePerMeter: 1 },
    { name: "Kiloampere/meter [kA/m]", amperePerMeter: 1000 },
    { name: "Oersted [Oe]", amperePerMeter: 79.5774715459 },
  ];

  const convertMagneticFieldStrength = () => {
    if (!inputValue) {
      setResult("Please enter a value");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const amperePerMeter = value * fromUnitData.amperePerMeter;
      const resultValue = amperePerMeter / toUnitData.amperePerMeter;
      let formattedResult;
      if (Math.abs(resultValue) > 1e6 || (Math.abs(resultValue) < 1e-3 && resultValue !== 0)) {
        formattedResult = resultValue.toExponential(6);
      } else {
        formattedResult = resultValue.toFixed(6).replace(/\.?0+$/, "");
      }
      setResult(`${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Conversion error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Magnetic Field Strength Converter
        </h2>
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
              step="any"
              placeholder="Enter value"
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
            onClick={convertMagneticFieldStrength}
            className="w-full bg-red-500 text-white p-3 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Convert
          </button>
          <div className="text-center text-lg font-medium text-gray-800 mt-4">Result: {result}</div>
        </div>
      </div>
    </div>
  );
}
