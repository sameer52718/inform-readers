"use client";

import { useState } from "react";

export default function HeatFluxDensityConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Watt/square meter [W/m²]");
  const [toUnit, setToUnit] = useState("Watt/square meter [W/m²]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Watt/square meter [W/m²]", wattPerSquareMeter: 1 },
    { name: "Kilowatt/square meter [kW/m²]", wattPerSquareMeter: 1000 },
    { name: "Watt/square centimeter [W/cm²]", wattPerSquareMeter: 10000 },
    { name: "Watt/square inch [W/in²]", wattPerSquareMeter: 1550.0031012075 },
    { name: "Joule/second/square meter [J/(s·m²)]", wattPerSquareMeter: 1 },
    { name: "Kilocalorie (IT)/hour/square meter [kcal (IT)/(h·m²)]", wattPerSquareMeter: 1.1629999999 },
    { name: "Kilocalorie (IT)/hour/square foot [kcal (IT)/(h·ft²)]", wattPerSquareMeter: 12.5184278205 },
    { name: "Calorie (IT)/second/square centimeter [cal (IT)/(s·cm²)]", wattPerSquareMeter: 41868.00000482 },
    {
      name: "Calorie (IT)/minute/square centimeter [cal (IT)/(min·cm²)]",
      wattPerSquareMeter: 697.8000000803,
    },
    { name: "Calorie (IT)/hour/square centimeter [cal (IT)/(h·cm²)]", wattPerSquareMeter: 11.6300000008 },
    { name: "Calorie (th)/second/square centimeter [cal (th)/(s·cm²)]", wattPerSquareMeter: 41839.999999942 },
    {
      name: "Calorie (th)/minute/square centimeter [cal (th)/(min·cm²)]",
      wattPerSquareMeter: 697.3333333314,
    },
    { name: "Calorie (th)/hour/square centimeter [cal (th)/(h·cm²)]", wattPerSquareMeter: 11.6222222222 },
    { name: "Dyne/hour/centimeter [dyn/(h·cm)]", wattPerSquareMeter: 2.7777777777778e-7 },
    { name: "Erg/hour/square millimeter [erg/(h·mm²)]", wattPerSquareMeter: 2.77778e-5 },
    { name: "Foot pound/minute/square foot [ft·lbf/(min·ft²)]", wattPerSquareMeter: 0.2432317156 },
    { name: "Horsepower/square foot [hp/ft²]", wattPerSquareMeter: 8026.6466174305 },
    { name: "Horsepower (metric)/square foot [hp (metric)/ft²]", wattPerSquareMeter: 7916.8426564296 },
    { name: "Btu (IT)/second/square foot [Btu (IT)/(s·ft²)]", wattPerSquareMeter: 11356.526682221 },
    { name: "Btu (IT)/minute/square foot [Btu (IT)/(min·ft²)]", wattPerSquareMeter: 189.2754465477 },
    { name: "Btu (IT)/hour/square foot [Btu (IT)/(h·ft²)]", wattPerSquareMeter: 3.1545907451 },
    { name: "Btu (th)/second/square inch [Btu (th)/(s·in²)]", wattPerSquareMeter: 1634246.1784508 },
    { name: "Btu (th)/second/square foot [Btu (th)/(s·ft²)]", wattPerSquareMeter: 11348.93179479 },
    { name: "Btu (th)/minute/square foot [Btu (th)/(min·ft²)]", wattPerSquareMeter: 189.1488632466 },
    { name: "Btu (th)/hour/square foot [Btu (th)/(h·ft²)]", wattPerSquareMeter: 3.1524810541 },
    { name: "CHU/hour/square foot [CHU/(h·ft²)]", wattPerSquareMeter: 5.6782633986 },
  ];

  const convertHeatFluxDensity = () => {
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
      const wattPerSquareMeter = value * fromUnitData.wattPerSquareMeter;
      const resultValue = wattPerSquareMeter / toUnitData.wattPerSquareMeter;
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
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Heat Flux Density Converter</h2>
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
            onClick={convertHeatFluxDensity}
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
