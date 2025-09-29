"use client";

import { useState } from "react";

export default function SpecificHeatCapacityConverter() {
  const units = [
    { name: "Joule/kilogram/K [J/(kg·K)]", joulePerKilogramK: 1 },
    { name: "Joule/kilogram/°C [J/(kg·°C)]", joulePerKilogramK: 1 },
    { name: "Joule/gram/°C [J/(g·°C)]", joulePerKilogramK: 1000 },
    { name: "Kilojoule/kilogram/K [kJ/(kg·K)]", joulePerKilogramK: 1000 },
    { name: "Kilojoule/kilogram/°C [kJ/(kg·°C)]", joulePerKilogramK: 1000 },
    { name: "Calorie (IT)/gram/°C [cal (IT)/(g·°C)]", joulePerKilogramK: 4186.8000000087 },
    { name: "Calorie (IT)/gram/°F [cal (IT)/(g·°F)]", joulePerKilogramK: 4186.8000000087 },
    { name: "Calorie (th)/gram/°C [cal (th)/(g·°C)]", joulePerKilogramK: 4184 },
    { name: "Kilocalorie (IT)/kilogram/°C [kcal (IT)/(kg·°C)]", joulePerKilogramK: 4186.8000000087 },
    { name: "Kilocalorie (th)/kilogram/°C [kcal (th)/(kg·°C)]", joulePerKilogramK: 4184 },
    { name: "Kilocalorie (IT)/kilogram/K [kcal (IT)/(kg·K)]", joulePerKilogramK: 4186.8000000087 },
    { name: "Kilocalorie (th)/kilogram/K [kcal (th)/(kg·K)]", joulePerKilogramK: 4184 },
    { name: "Kilogram-force meter/kilogram/K [kgf·m/(kg·K)]", joulePerKilogramK: 9.80665 },
    { name: "Pound-force foot/pound/°R [lbf·ft/(lb·°R)]", joulePerKilogramK: 5.380320456 },
    { name: "Btu (IT)/pound/°F [Btu (IT)/(lb·°F)]", joulePerKilogramK: 4186.8000000087 },
    { name: "Btu (th)/pound/°F [Btu (th)/(lb·°F)]", joulePerKilogramK: 4184 },
    { name: "Btu (IT)/pound/°R [Btu (IT)/(lb·°R)]", joulePerKilogramK: 4186.8000000087 },
    { name: "Btu (th)/pound/°R [Btu (th)/(lb·°R)]", joulePerKilogramK: 4184 },
    { name: "Btu (IT)/pound/°C [Btu (IT)/(lb·°C)]", joulePerKilogramK: 2326.0000001596 },
    { name: "CHU/pound/°C [CHU/(lb·°C)]", joulePerKilogramK: 4186.800000482 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("Result: ");

  const convertSpecificHeatCapacity = () => {
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

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);

    try {
      const joulePerKilogramK = parsedValue * fromUnitData.joulePerKilogramK;
      const resultValue = joulePerKilogramK / toUnitData.joulePerKilogramK;
      let formattedResult;
      if (Math.abs(resultValue) > 1e6 || (Math.abs(resultValue) < 1e-3 && resultValue !== 0)) {
        formattedResult = resultValue.toExponential(6);
      } else {
        formattedResult = resultValue.toFixed(6).replace(/\.?0+$/, "");
      }
      setResult(`Result: ${parsedValue} ${fromUnit} = ${formattedResult} ${toUnit}`);
    } catch (error) {
      setResult("Result: Conversion error");
    }
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Specific Heat Capacity Converter
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
            onClick={convertSpecificHeatCapacity}
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
