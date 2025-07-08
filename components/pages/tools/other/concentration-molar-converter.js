"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Mol/cubic meter [mol/m³]");
  const [toUnit, setToUnit] = useState("Mol/liter [mol/L]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Mol/cubic meter [mol/m³]", molPerCubicMeter: 1 },
    { name: "Mol/liter [mol/L]", molPerCubicMeter: 1000 },
    { name: "Mol/cubic centimeter [mol/cm³]", molPerCubicMeter: 1000000 },
    { name: "Mol/cubic millimeter [mol/mm³]", molPerCubicMeter: 1000000000 },
    { name: "Kilomol/cubic meter [kmol/m³]", molPerCubicMeter: 1000 },
    { name: "Kilomol/liter [kmol/L]", molPerCubicMeter: 1000000 },
    { name: "Kilomol/cubic centimeter [kmol/cm³]", molPerCubicMeter: 1000000000 },
    { name: "Kilomol/cubic millimeter [kmol/mm³]", molPerCubicMeter: 1000000000000 },
    { name: "Millimol/cubic meter [mmol/m³]", molPerCubicMeter: 0.001 },
    { name: "Millimol/liter [mmol/L]", molPerCubicMeter: 1 },
    { name: "Millimol/cubic centimeter [mmol/cm³]", molPerCubicMeter: 1000 },
    { name: "Millimol/cubic millimeter [mmol/mm³]", molPerCubicMeter: 1000000 },
  ];

  const convertMolarConcentration = () => {
    const value = inputValue.trim();
    if (!value) {
      setResult("Result: Please enter a value");
      return;
    }

    const parsedValue = parseFloat(value);
    if (isNaN(parsedValue) || parsedValue < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }

    try {
      const fromUnitData = units.find((unit) => unit.name === fromUnit);
      const toUnitData = units.find((unit) => unit.name === toUnit);
      const molPerCubicMeter = parsedValue * fromUnitData.molPerCubicMeter;
      const converted = molPerCubicMeter / toUnitData.molPerCubicMeter;
      let formattedResult;
      if (Math.abs(converted) > 1e6 || (Math.abs(converted) < 1e-3 && converted !== 0)) {
        formattedResult = converted.toExponential(6);
      } else {
        formattedResult = converted.toFixed(6).replace(/\.?0+$/, "");
      }
      setResult(`Result: ${parsedValue} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Result: Conversion error");
    }
  };

  return (
    <div className="bg-white min-h-screen p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Concentration - Molar Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              step="any"
              min="0"
              placeholder="Enter value"
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
            onClick={convertMolarConcentration}
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
