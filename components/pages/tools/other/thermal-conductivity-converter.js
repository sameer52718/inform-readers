"use client";

import { useState } from "react";

export default function Home() {
  const units = [
    { name: "Watt/meter/K [W/(m·K)]", wattPerMeterK: 1 },
    { name: "Watt/centimeter/°C [W/(cm·°C)]", wattPerMeterK: 100 },
    { name: "Kilowatt/meter/K [kW/(m·K)]", wattPerMeterK: 1000 },
    { name: "Calorie (IT)/second/cm/°C [cal (IT)/(s·cm·°C)]", wattPerMeterK: 418.6800000009 },
    { name: "Calorie (th)/second/cm/°C [cal (th)/(s·cm·°C)]", wattPerMeterK: 418.3999999994 },
    { name: "Kilocalorie (IT)/hour/meter/°C [kcal (IT)/(h·m·°C)]", wattPerMeterK: 1.163 },
    { name: "Kilocalorie (th)/hour/meter/°C [kcal (th)/(h·m·°C)]", wattPerMeterK: 1.1622222222 },
    { name: "Btu (IT) inch/second/sq. foot/°F [Btu (IT)·in/(s·ft²·°F)]", wattPerMeterK: 519.2203999105 },
    { name: "Btu (th) inch/second/sq. foot/°F [Btu (th)·in/(s·ft²·°F)]", wattPerMeterK: 518.8731616576 },
    { name: "Btu (IT) foot/hour/sq. foot/°F [Btu (IT)·ft/(h·ft²·°F)]", wattPerMeterK: 1.7307346664 },
    { name: "Btu (th) foot/hour/sq. foot/°F [Btu (th)·ft/(h·ft²·°F)]", wattPerMeterK: 1.7295772055 },
    { name: "Btu (IT) inch/hour/sq. foot/°F [Btu (IT)·in/(h·ft²·°F)]", wattPerMeterK: 0.1442278889 },
    { name: "Btu (th) inch/hour/sq. foot/°F [Btu (th)·in/(h·ft²·°F)]", wattPerMeterK: 0.1441314338 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("Result: ");

  const handleConvert = () => {
    const value = parseFloat(inputValue);
    if (!inputValue) {
      setResult("Result: Please enter a value");
      return;
    }
    if (isNaN(value) || value < 0) {
      setResult("Result: Please enter a valid non-negative number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const wattPerMeterK = value * fromUnitData.wattPerMeterK;
      const converted = wattPerMeterK / toUnitData.wattPerMeterK;
      let formattedResult;
      if (Math.abs(converted) > 1e6 || (Math.abs(converted) < 1e-3 && converted !== 0)) {
        formattedResult = converted.toExponential(6);
      } else {
        formattedResult = converted.toFixed(6).replace(/\.?0+$/, "");
      }
      setResult(`Result: ${value} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Result: Conversion error");
    }
  };

  return (
    <div className="bg-white min-h-screen flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Thermal Conductivity Converter</h2>
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
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
            onClick={handleConvert}
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
