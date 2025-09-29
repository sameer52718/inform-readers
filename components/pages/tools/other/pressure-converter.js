"use client";

import { useState } from "react";

export default function PressureConverter() {
  const units = [
    { name: "pascal [Pa]", toPascal: 1 },
    { name: "kilopascal [kPa]", toPascal: 1000 },
    { name: "bar", toPascal: 100000 },
    { name: "psi [psi]", toPascal: 6894.7572931783 },
    { name: "ksi [ksi]", toPascal: 6894757.2931783 },
    { name: "Standard atmosphere [atm]", toPascal: 101325 },
    { name: "exapascal [EPa]", toPascal: 1.0e18 },
    { name: "petapascal [PPa]", toPascal: 1.0e15 },
    { name: "terapascal [TPa]", toPascal: 1000000000000 },
    { name: "gigapascal [GPa]", toPascal: 1000000000 },
    { name: "megapascal [MPa]", toPascal: 1000000 },
    { name: "hectopascal [hPa]", toPascal: 100 },
    { name: "dekapascal [daPa]", toPascal: 10 },
    { name: "decipascal [dPa]", toPascal: 0.1 },
    { name: "centipascal [cPa]", toPascal: 0.01 },
    { name: "millipascal [mPa]", toPascal: 0.001 },
    { name: "micropascal [µPa]", toPascal: 1.0e-6 },
    { name: "nanopascal [nPa]", toPascal: 1.0e-9 },
    { name: "picopascal [pPa]", toPascal: 1.0e-12 },
    { name: "femtopascal [fPa]", toPascal: 1.0e-15 },
    { name: "attopascal [aPa]", toPascal: 1.0e-18 },
    { name: "newton/square meter", toPascal: 1 },
    { name: "newton/square centimeter", toPascal: 10000 },
    { name: "newton/square millimeter", toPascal: 1000000 },
    { name: "kilonewton/square meter", toPascal: 1000 },
    { name: "millibar [mbar]", toPascal: 100 },
    { name: "microbar [µbar]", toPascal: 0.1 },
    { name: "dyne/square centimeter", toPascal: 0.1 },
    { name: "kilogram-force/square meter", toPascal: 9.80665 },
    { name: "kilogram-force/sq. cm", toPascal: 98066.5 },
    { name: "kilogram-force/sq. millimeter", toPascal: 9806650 },
    { name: "gram-force/sq. centimeter", toPascal: 98.0665 },
    { name: "ton-force (short)/sq. foot", toPascal: 95760.517960678 },
    { name: "ton-force (short)/sq. inch", toPascal: 13789514.586338 },
    { name: "ton-force (long)/square foot", toPascal: 107251.78011595 },
    { name: "ton-force (long)/square inch", toPascal: 15444256.336697 },
    { name: "kip-force/square inch", toPascal: 6894757.2931783 },
    { name: "pound-force/square foot", toPascal: 47.8802589804 },
    { name: "pound-force/square inch", toPascal: 6894.7572931783 },
    { name: "poundal/square foot", toPascal: 1.4881639436 },
    { name: "torr [Torr]", toPascal: 133.3223684211 },
    { name: "centimeter mercury (0°C)", toPascal: 1333.22 },
    { name: "millimeter mercury (0°C)", toPascal: 133.322 },
    { name: "inch mercury (32°F) [inHg]", toPascal: 3386.38 },
    { name: "inch mercury (60°F) [inHg]", toPascal: 3376.85 },
    { name: "centimeter water (4°C)", toPascal: 98.0638 },
    { name: "millimeter water (4°C)", toPascal: 9.80638 },
    { name: "inch water (4°C) [inAq]", toPascal: 249.082 },
    { name: "foot water (4°C) [ftAq]", toPascal: 2988.98 },
    { name: "inch water (60°F) [inAq]", toPascal: 248.843 },
    { name: "foot water (60°F) [ftAq]", toPascal: 2986.116 },
    { name: "atmosphere technical [at]", toPascal: 98066.500000003 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("Result: ");

  const convertPressure = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);
    const pascal = value * fromUnitData.toPascal;
    const resultValue = pascal / toUnitData.toPascal;

    setResult(`Result: ${value} ${fromUnit} = ${resultValue.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className=" bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Pressure Converter</h2>
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
              placeholder="Enter value"
              step="any"
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
            onClick={convertPressure}
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
