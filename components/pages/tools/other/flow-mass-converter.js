"use client";

import { useState, useEffect } from "react";

export default function MassFlowConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Kilogram/second [kg/s]");
  const [toUnit, setToUnit] = useState("Kilogram/second [kg/s]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Kilogram/second [kg/s]", kilogramPerSecond: 1 },
    { name: "Gram/second [g/s]", kilogramPerSecond: 0.001 },
    { name: "Gram/minute [g/min]", kilogramPerSecond: 1.66667e-5 },
    { name: "Gram/hour [g/h]", kilogramPerSecond: 2.7777777777778e-7 },
    { name: "Gram/day [g/d]", kilogramPerSecond: 1.1574074074074e-8 },
    { name: "Milligram/minute [mg/min]", kilogramPerSecond: 1.6666666666667e-8 },
    { name: "Milligram/hour [mg/h]", kilogramPerSecond: 2.7777777777778e-10 },
    { name: "Milligram/day [mg/d]", kilogramPerSecond: 1.1574074074074e-11 },
    { name: "Kilogram/minute [kg/min]", kilogramPerSecond: 0.0166666667 },
    { name: "Kilogram/hour [kg/h]", kilogramPerSecond: 0.0002777778 },
    { name: "Kilogram/day [kg/d]", kilogramPerSecond: 1.15741e-5 },
    { name: "Exagram/second [Eg/s]", kilogramPerSecond: 1.0e15 },
    { name: "Petagram/second [Pg/s]", kilogramPerSecond: 1000000000000 },
    { name: "Teragram/second [Tg/s]", kilogramPerSecond: 1000000000 },
    { name: "Gigagram/second [Gg/s]", kilogramPerSecond: 1000000 },
    { name: "Megagram/second [Mg/s]", kilogramPerSecond: 1000 },
    { name: "Hectogram/second [hg/s]", kilogramPerSecond: 0.1 },
    { name: "Dekagram/second [dag/s]", kilogramPerSecond: 0.01 },
    { name: "Decigram/second [dg/s]", kilogramPerSecond: 0.0001 },
    { name: "Centigram/second [cg/s]", kilogramPerSecond: 1.0e-5 },
    { name: "Milligram/second [mg/s]", kilogramPerSecond: 1.0e-6 },
    { name: "Microgram/second [µg/s]", kilogramPerSecond: 1.0e-9 },
    { name: "Ton (metric)/second [t/s]", kilogramPerSecond: 1000 },
    { name: "Ton (metric)/minute [t/min]", kilogramPerSecond: 16.6666666667 },
    { name: "Ton (metric)/hour [t/h]", kilogramPerSecond: 0.2777777778 },
    { name: "Ton (metric)/day [t/d]", kilogramPerSecond: 0.0115740741 },
    { name: "Ton (short)/hour [ton (US)/h]", kilogramPerSecond: 0.2519957611 },
    { name: "Pound/second [lb/s]", kilogramPerSecond: 0.45359237 },
    { name: "Pound/minute [lb/min]", kilogramPerSecond: 0.0075598728 },
    { name: "Pound/hour [lb/h]", kilogramPerSecond: 0.0001259979 },
    { name: "Pound/day [lb/d]", kilogramPerSecond: 5.2499116898148e-6 },
  ];

  const convertMassFlow = () => {
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
      const kilogramPerSecond = value * fromUnitData.kilogramPerSecond;
      const resultValue = kilogramPerSecond / toUnitData.kilogramPerSecond;
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
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Flow - Mass Converter</h2>
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
            onClick={convertMassFlow}
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
