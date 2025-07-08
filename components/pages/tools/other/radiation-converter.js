"use client";

import { useState } from "react";

export default function RadiationConverter() {
  const units = [
    { name: "Gray/second [Gy/s]", grayPerSecond: 1 },
    { name: "Exagray/second [EGy/s]", grayPerSecond: 1.0e18 },
    { name: "Petagray/second [PGy/s]", grayPerSecond: 1.0e15 },
    { name: "Teragray/second [TGy/s]", grayPerSecond: 1.0e12 },
    { name: "Gigagray/second [GGy/s]", grayPerSecond: 1.0e9 },
    { name: "Megagray/second [MGy/s]", grayPerSecond: 1.0e6 },
    { name: "Kilogray/second [kGy/s]", grayPerSecond: 1.0e3 },
    { name: "Hectogray/second [hGy/s]", grayPerSecond: 1.0e2 },
    { name: "Dekagray/second [daGy/s]", grayPerSecond: 1.0e1 },
    { name: "Decigray/second [dGy/s]", grayPerSecond: 1.0e-1 },
    { name: "Centigray/second [cGy/s]", grayPerSecond: 1.0e-2 },
    { name: "Milligray/second [mGy/s]", grayPerSecond: 1.0e-3 },
    { name: "Microgray/second [µGy/s]", grayPerSecond: 1.0e-6 },
    { name: "Nanogray/second [nGy/s]", grayPerSecond: 1.0e-9 },
    { name: "Picogray/second [pGy/s]", grayPerSecond: 1.0e-12 },
    { name: "Femtogray/second [fGy/s]", grayPerSecond: 1.0e-15 },
    { name: "Attogray/second [aGy/s]", grayPerSecond: 1.0e-18 },
    { name: "Rad/second [rd/s, rad/s]", grayPerSecond: 0.01 },
    { name: "Joule/kilogram/second [J/kg/s]", grayPerSecond: 1 },
    { name: "Watt/kilogram [W/kg]", grayPerSecond: 1 },
    { name: "Sievert/second [Sv/s]", grayPerSecond: 1 },
    { name: "Rem/second [rem/s]", grayPerSecond: 0.01 },
  ];

  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState(units[0].name);
  const [toUnit, setToUnit] = useState(units[0].name);
  const [result, setResult] = useState("Result: ");

  const convertRadiation = () => {
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
      const grayPerSecond = parsedValue * fromUnitData.grayPerSecond;
      const resultValue = grayPerSecond / toUnitData.grayPerSecond;
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
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">Radiation Converter</h2>
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
            onClick={convertRadiation}
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
