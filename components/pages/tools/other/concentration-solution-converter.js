"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Kilogram/liter [kg/L]");
  const [toUnit, setToUnit] = useState("Gram/liter [g/L]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Kilogram/liter [kg/L]", kilogramPerLiter: 1 },
    { name: "Gram/liter [g/L]", kilogramPerLiter: 0.001 },
    { name: "Milligram/liter [mg/L]", kilogramPerLiter: 1.0e-6 },
    { name: "Part/million [ppm]", kilogramPerLiter: 9.988590003673e-7 },
    { name: "Grain/gallon (US) [gr/gal (US)]", kilogramPerLiter: 1.71181e-5 },
    { name: "Grain/gallon (UK) [gr/gal (UK)]", kilogramPerLiter: 1.42538e-5 },
    { name: "Pound/gallon (US) [lb/gal (US)]", kilogramPerLiter: 0.1198264284 },
    { name: "Pound/gallon (UK) [lb/gal (UK)]", kilogramPerLiter: 0.0997763736 },
    { name: "Pound/million gallon (US) [lb/mil gal (US)]", kilogramPerLiter: 1.1982642843713e-7 },
    { name: "Pound/million gallon (UK) [lb/mil gal (UK)]", kilogramPerLiter: 9.9776373608464e-8 },
    { name: "Pound/cubic foot [lb/ft³]", kilogramPerLiter: 0.0160184635 },
  ];

  const convertSolutionConcentration = () => {
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
      const kilogramPerLiter = parsedValue * fromUnitData.kilogramPerLiter;
      const converted = kilogramPerLiter / toUnitData.kilogramPerLiter;
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
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">
          Concentration - Solution Converter
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
            onClick={convertSolutionConcentration}
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
