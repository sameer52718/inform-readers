"use client";

import { useState } from "react";

export default function Home() {
  const [inputValue, setInputValue] = useState("");
  const [fromUnit, setFromUnit] = useState("square meter [m^2]");
  const [toUnit, setToUnit] = useState("hectare [ha]");
  const [result, setResult] = useState("Result: ");

  const units = [
    { name: "square meter [m^2]", toSquareMeter: 1 },
    { name: "square kilometer [km^2]", toSquareMeter: 1000000 },
    { name: "square centimeter [cm^2]", toSquareMeter: 0.0001 },
    { name: "square millimeter [mm^2]", toSquareMeter: 1.0e-6 },
    { name: "square micrometer [µm^2]", toSquareMeter: 1.0e-12 },
    { name: "hectare [ha]", toSquareMeter: 10000 },
    { name: "acre [ac]", toSquareMeter: 4046.8564224 },
    { name: "square mile [mi^2]", toSquareMeter: 2589988.110336 },
    { name: "square yard [yd^2]", toSquareMeter: 0.83612736 },
    { name: "square foot [ft^2]", toSquareMeter: 0.09290304 },
    { name: "square inch [in^2]", toSquareMeter: 0.00064516 },
    { name: "square hectometer [hm^2]", toSquareMeter: 10000 },
    { name: "square dekameter [dam^2]", toSquareMeter: 100 },
    { name: "square decimeter [dm^2]", toSquareMeter: 0.01 },
    { name: "square nanometer [nm^2]", toSquareMeter: 1.0e-18 },
    { name: "are [a]", toSquareMeter: 100 },
    { name: "barn [b]", toSquareMeter: 1.0e-28 },
    { name: "square mile (US survey)", toSquareMeter: 2589998.4703195 },
    { name: "square foot (US survey)", toSquareMeter: 0.0929034116 },
    { name: "circular inch", toSquareMeter: 0.0005067075 },
    { name: "township", toSquareMeter: 93239571.972096 },
    { name: "section", toSquareMeter: 2589988.110336 },
    { name: "acre (US survey) [ac]", toSquareMeter: 4046.8726098743 },
    { name: "rood", toSquareMeter: 1011.7141056 },
    { name: "square chain [ch^2]", toSquareMeter: 404.68564224 },
    { name: "square rod", toSquareMeter: 25.29285264 },
    { name: "square rod (US survey)", toSquareMeter: 25.2929538117 },
    { name: "square perch", toSquareMeter: 25.29285264 },
    { name: "square pole", toSquareMeter: 25.29285264 },
    { name: "square mil [mil^2]", toSquareMeter: 6.4516e-10 },
    { name: "circular mil", toSquareMeter: 5.067074790975e-10 },
    { name: "homestead", toSquareMeter: 647497.027584 },
    { name: "sabin", toSquareMeter: 0.09290304 },
    { name: "arpent", toSquareMeter: 3418.8929236669 },
    { name: "cuerda", toSquareMeter: 3930.395625 },
    { name: "plaza", toSquareMeter: 6400 },
    { name: "varas castellanas cuad", toSquareMeter: 0.698737 },
    { name: "varas conuqueras cuad", toSquareMeter: 6.288633 },
    { name: "Electron cross section", toSquareMeter: 6.6524615999999e-29 },
  ];

  const convertArea = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) {
      setResult("Result: Please enter a valid number");
      return;
    }

    const fromUnitData = units.find((unit) => unit.name === fromUnit);
    const toUnitData = units.find((unit) => unit.name === toUnit);
    const squareMeters = value * fromUnitData.toSquareMeter;
    const converted = squareMeters / toUnitData.toSquareMeter;
    setResult(`Result: ${value} ${fromUnit} = ${converted.toFixed(6)} ${toUnit}`);
  };

  return (
    <div className="bg-white  p-4 flex justify-center items-center">
      <div className="bg-gray-100 rounded-2xl shadow-2xl p-8 w-full max-w-md">
        <h2 className="text-3xl font-bold text-center text-red-500 mb-6">Area Converter</h2>
        <div className="space-y-4">
          <div>
            <label htmlFor="inputValue" className="block text-sm font-medium text-gray-700">
              Enter Value
            </label>
            <input
              type="number"
              id="inputValue"
              placeholder="Enter value"
              step="any"
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
            onClick={convertArea}
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
