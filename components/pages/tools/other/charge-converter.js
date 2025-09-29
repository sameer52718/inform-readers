"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Coulomb [C]");
  const [toUnit, setToUnit] = useState("Millicoulomb [mC]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Coulomb [C]", coulombs: 1 },
    { name: "Megacoulomb [MC]", coulombs: 1000000 },
    { name: "Kilocoulomb [kC]", coulombs: 1000 },
    { name: "Millicoulomb [mC]", coulombs: 0.001 },
    { name: "Microcoulomb [µC]", coulombs: 1.0e-6 },
    { name: "Nanocoulomb [nC]", coulombs: 1.0e-9 },
    { name: "Picocoulomb [pC]", coulombs: 1.0e-12 },
    { name: "Abcoulomb [abC]", coulombs: 10 },
    { name: "EMU of charge", coulombs: 10 },
    { name: "Statcoulomb [stC]", coulombs: 3.335640951982e-10 },
    { name: "ESU of charge", coulombs: 3.335640951982e-10 },
    { name: "Franklin [Fr]", coulombs: 3.335640951982e-10 },
    { name: "Ampere-hour [A*h]", coulombs: 3600 },
    { name: "Ampere-minute [A*min]", coulombs: 60 },
    { name: "Ampere-second [A*s]", coulombs: 1 },
    { name: "Faraday (based on carbon 12)", coulombs: 96485.309000004 },
    { name: "Elementary charge [e]", coulombs: 1.60217733e-19 },
  ];

  const convertCharge = () => {
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
      const coulombs = parsedValue * fromUnitData.coulombs;
      const converted = coulombs / toUnitData.coulombs;
      let formattedResult;
      if (Math.abs(converted) > 1e6 || (Math.abs(converted) < 1e-6 && converted !== 0)) {
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
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Charge Converter</h2>
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
            onClick={convertCharge}
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
