"use client";

import { useState } from "react";

export default function ForceConverter() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("Newton [N]");
  const [toUnit, setToUnit] = useState("Newton [N]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "Newton [N]", newtons: 1 },
    { name: "Kilonewton [kN]", newtons: 1000 },
    { name: "Gram-force [gf]", newtons: 0.00980665 },
    { name: "Kilogram-force [kgf]", newtons: 9.80665 },
    { name: "Ton-force (metric) [tf]", newtons: 9806.65 },
    { name: "Exanewton [EN]", newtons: 1.0e18 },
    { name: "Petanewton [PT]", newtons: 1.0e15 },
    { name: "Teranewton [TN]", newtons: 1000000000000 },
    { name: "Giganewton [GN]", newtons: 1000000000 },
    { name: "Meganewton [MN]", newtons: 1000000 },
    { name: "Hectonewton [hN]", newtons: 100 },
    { name: "Dekanewton [daN]", newtons: 10 },
    { name: "Decinewton [dN]", newtons: 0.1 },
    { name: "Centinewton [cN]", newtons: 0.01 },
    { name: "Millinewton [mN]", newtons: 0.001 },
    { name: "Micronewton [µN]", newtons: 1.0e-6 },
    { name: "Nanonewton [nN]", newtons: 1.0e-9 },
    { name: "Piconewton [pN]", newtons: 1.0e-12 },
    { name: "Femtonewton [fN]", newtons: 1.0e-15 },
    { name: "Attonewton [aN]", newtons: 1.0e-18 },
    { name: "Dyne [dyn]", newtons: 1.0e-5 },
    { name: "Joule/meter [J/m]", newtons: 1 },
    { name: "Joule/centimeter [J/cm]", newtons: 0.01 },
    { name: "Ton-force (short)", newtons: 8896.443230521 },
    { name: "Ton-force (long) [tonf (UK)]", newtons: 9964.0164181707 },
    { name: "Kip-force [kipf]", newtons: 4448.2216152548 },
    { name: "Kilopound-force [kipf]", newtons: 4448.2216152548 },
    { name: "Pound-force [lbf]", newtons: 4.4482216153 },
    { name: "Ounce-force [ozf]", newtons: 0.278013851 },
    { name: "Poundal [pdl]", newtons: 0.1382549544 },
    { name: "Pound foot/square second", newtons: 0.1382549544 },
    { name: "Pond [p]", newtons: 0.00980665 },
    { name: "Kilopond [kp]", newtons: 9.80665 },
  ];

  const convertForce = () => {
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
      const newtons = value * fromUnitData.newtons;
      const resultValue = newtons / toUnitData.newtons;
      let formattedResult;
      if (Math.abs(resultValue) > 1e6 || (Math.abs(resultValue) < 1e-6 && resultValue !== 0)) {
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
    <div className="flex justify-center items-center  bg-white p-4">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Force Converter</h2>
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
            onClick={convertForce}
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
