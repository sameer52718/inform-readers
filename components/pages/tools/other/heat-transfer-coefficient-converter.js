"use client";

import { useState } from "react";

export default function HeatTransferCoefficientConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Watt/square meter/K [W/(m²·K)]");
  const [toUnit, setToUnit] = useState("Watt/square meter/K [W/(m²·K)]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Watt/square meter/K [W/(m²·K)]", wattPerSquareMeterK: 1 },
    { name: "Watt/square meter/°C [W/(m²·°C)]", wattPerSquareMeterK: 1 },
    { name: "Joule/second/square meter/K [J/(s·m²·K)]", wattPerSquareMeterK: 1 },
    {
      name: "Calorie (IT)/second/square centimeter/°C [cal (IT)/(s·cm²·°C)]",
      wattPerSquareMeterK: 41868.00000482,
    },
    { name: "Kilocalorie (IT)/hour/square meter/°C [kcal (IT)/(h·m²·°C)]", wattPerSquareMeterK: 1.163 },
    {
      name: "Kilocalorie (IT)/hour/square foot/°C [kcal (IT)/(h·ft²·°C)]",
      wattPerSquareMeterK: 12.5184278205,
    },
    { name: "Btu (IT)/second/square foot/°F [Btu (IT)/(s·ft²·°F)]", wattPerSquareMeterK: 20441.748028012 },
    { name: "Btu (th)/second/square foot/°F [Btu (th)/(s·ft²·°F)]", wattPerSquareMeterK: 20428.077230618 },
    { name: "Btu (IT)/hour/square foot/°F [Btu (IT)/(h·ft²·°F)]", wattPerSquareMeterK: 5.6782633411 },
    { name: "Btu (th)/hour/square foot/°F [Btu (th)/(h·ft²·°F)]", wattPerSquareMeterK: 5.6744658974 },
    { name: "CHU/hour/square foot/°C [CHU/(h·ft²·°C)]", wattPerSquareMeterK: 5.6782633411 },
  ];

  const convertHeatTransferCoefficient = () => {
    if (!inputValue.trim()) {
      setResult("Result: Please enter a value");
      return;
    }

    const value = parseFloat(inputValue);
    if (isNaN(value) || value < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const wattPerSquareMeterK = value * fromUnitData.wattPerSquareMeterK;
      const resultValue = wattPerSquareMeterK / toUnitData.wattPerSquareMeterK;
      let formattedResult;
      if (Math.abs(resultValue) > 1e6 || (Math.abs(resultValue) < 1e-3 && resultValue !== 0)) {
        formattedResult = resultValue.toExponential(6);
      } else {
        formattedResult = resultValue.toFixed(6).replace(/\.?0+$/, "");
      }
      setResult(`Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Result: Conversion error");
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">
          Heat Transfer Coefficient Converter
        </h2>
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
            onClick={convertHeatTransferCoefficient}
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
