"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Candela/square meter [cd/m²]");
  const [toUnit, setToUnit] = useState("Candela/square meter [cd/m²]");
  const [result, setResult] = useState("");

  const units = [
    { name: "Candela/square meter [cd/m²]", candelaPerSquareMeter: 1 },
    { name: "Candela/square centimeter [cd/cm²]", candelaPerSquareMeter: 10000 },
    { name: "Candela/square foot [cd/ft²]", candelaPerSquareMeter: 10.7639104167 },
    { name: "Candela/square inch [cd/in²]", candelaPerSquareMeter: 1550.0031000062 },
    { name: "Kilocandela/square meter [kcd/m²]", candelaPerSquareMeter: 1000 },
    { name: "Stilb [sb]", candelaPerSquareMeter: 10000 },
    { name: "Lumen/square meter/steradian [lm/m²/sr]", candelaPerSquareMeter: 1 },
    { name: "Lumen/square centimeter/steradian [lm/cm²/sr]", candelaPerSquareMeter: 10000 },
    { name: "Lumen/square foot/steradian [lm/ft²/sr]", candelaPerSquareMeter: 10.7639104167 },
    { name: "Watt/square centimeter/steradian (at 555 nm) [W/cm²/sr]", candelaPerSquareMeter: 6830000 },
    { name: "Nit [nt]", candelaPerSquareMeter: 1 },
    { name: "Millinit [mnt]", candelaPerSquareMeter: 0.001 },
    { name: "Lambert [L]", candelaPerSquareMeter: 3183.0988618379 },
    { name: "Millilambert [mL]", candelaPerSquareMeter: 3.1830988618 },
    { name: "Foot-lambert [fL]", candelaPerSquareMeter: 3.4262590996 },
    { name: "Apostilb", candelaPerSquareMeter: 0.3183098862 },
    { name: "Blondel", candelaPerSquareMeter: 0.3183098862 },
    { name: "Bril", candelaPerSquareMeter: 3.1830988618379e-8 },
    { name: "Skot", candelaPerSquareMeter: 0.0003183099 },
  ];

  const convertLuminance = () => {
    if (!inputValue) {
      setResult("Please enter a value");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setResult("Please enter a valid non-negative number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const candelaPerSquareMeter = value * fromUnitData.candelaPerSquareMeter;
      const resultValue = candelaPerSquareMeter / toUnitData.candelaPerSquareMeter;
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
    <div className="flex justify-center items-center  bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-lg p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Luminance Converter</h2>
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
              min="0"
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
            onClick={convertLuminance}
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
