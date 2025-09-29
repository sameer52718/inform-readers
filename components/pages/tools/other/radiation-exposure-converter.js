"use client";

import { useState } from "react";

export default function RadiationExposureConverter() {
  const units = [
    { value: "C/kg", label: "coulomb/kilogram [C/kg]" },
    { value: "mC/kg", label: "millicoulomb/kilogram [mC/kg]" },
    { value: "µC/kg", label: "microcoulomb/kilogram [µC/kg]" },
    { value: "R", label: "roentgen [R]" },
    { value: "tissue roentgen", label: "tissue roentgen" },
    { value: "parker", label: "parker" },
    { value: "rep", label: "rep" },
  ];

  const toCoulombPerKg = {
    "C/kg": 1,
    "mC/kg": 0.001,
    "µC/kg": 0.000001,
    R: 0.000258,
    "tissue roentgen": 0.000258,
    parker: 0.000258,
    rep: 0.000258,
  };

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("C/kg");
  const [toUnit, setToUnit] = useState("C/kg");
  const [result, setResult] = useState("");

  const convert = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult('<span className="text-red-500">Please enter a valid number</span>');
      return;
    }

    if (!(fromUnit in toCoulombPerKg) || !(toUnit in toCoulombPerKg)) {
      setResult('<span className="text-red-500">Invalid unit selected</span>');
      return;
    }

    const valueInCoulombPerKg = value * toCoulombPerKg[fromUnit];
    const resultValue = valueInCoulombPerKg / toCoulombPerKg[toUnit];
    setResult(`${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 p-5 rounded-lg max-w-md w-full shadow-lg">
        <h1 className="text-red-500 text-2xl text-center mb-5">Radiation-Exposure Converter</h1>
        <div className="mb-4">
          <label htmlFor="inputValue" className="block text-sm mb-1">
            Value
          </label>
          <input
            type="number"
            id="inputValue"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder="Enter value"
            className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
          />
        </div>
        <div className="flex gap-4 mb-4">
          <div className="flex-1">
            <label htmlFor="fromUnit" className="block text-sm mb-1">
              From
            </label>
            <select
              id="fromUnit"
              value={fromUnit}
              onChange={(e) => setFromUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex-1">
            <label htmlFor="toUnit" className="block text-sm mb-1">
              To
            </label>
            <select
              id="toUnit"
              value={toUnit}
              onChange={(e) => setToUnit(e.target.value)}
              className="w-full p-2 bg-gray-200 rounded-md text-base focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {units.map((unit) => (
                <option key={unit.value} value={unit.value}>
                  {unit.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        <button
          onClick={convert}
          className="w-full p-2 bg-red-500 text-white font-bold rounded-md hover:bg-red-600 transition"
        >
          Convert
        </button>
        <div className="mt-5 text-center text-base" dangerouslySetInnerHTML={{ __html: result }} />
      </div>
    </div>
  );
}
